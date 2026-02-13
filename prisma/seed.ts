import { prisma } from '../src/db/db';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

type CsvRow = Record<string, string>;

type FieldInfo = {
  name: string;
  type: string;
  isList: boolean;
  isOptional: boolean;
  isScalar: boolean;
  isEnum: boolean;
  hasDefault: boolean;
};

const SCALAR_TYPES = new Set([
  'String',
  'Int',
  'Float',
  'Boolean',
  'DateTime',
  'Json',
  'Bytes',
  'Decimal',
  'BigInt',
]);

function getArgValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function toClientKey(modelName: string): string {
  return modelName.length === 0
    ? modelName
    : modelName[0].toLowerCase() + modelName.slice(1);
}

function parseSchema(schemaText: string): {
  enums: Set<string>;
  models: Record<string, FieldInfo[]>;
} {
  const enums = new Set<string>();
  const enumRegex = /enum\s+(\w+)\s*\{/g;
  let enumMatch: RegExpExecArray | null;
  while ((enumMatch = enumRegex.exec(schemaText)) !== null) {
    enums.add(enumMatch[1]);
  }

  const models: Record<string, FieldInfo[]> = {};
  const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let modelMatch: RegExpExecArray | null;
  while ((modelMatch = modelRegex.exec(schemaText)) !== null) {
    const modelName = modelMatch[1];
    const body = modelMatch[2];
    const lines = body.split(/\r?\n/);
    const fields: FieldInfo[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) {
        continue;
      }
      const fieldMatch =
        /^(\w+)\s+([A-Za-z_][A-Za-z0-9_]*)(\[\])?(\?)?(.*)$/.exec(trimmed);
      if (!fieldMatch) continue;
      const name = fieldMatch[1];
      const type = fieldMatch[2];
      const isList = Boolean(fieldMatch[3]);
      const isOptional = Boolean(fieldMatch[4]);
      const attributes = fieldMatch[5] ?? '';
      const hasDefault =
        /@default\b/.test(attributes) || /@updatedAt\b/.test(attributes);
      const isEnum = enums.has(type);
      const isScalar = SCALAR_TYPES.has(type) || isEnum;
      fields.push({
        name,
        type,
        isList,
        isOptional,
        isScalar,
        isEnum,
        hasDefault,
      });
    }
    models[modelName] = fields;
  }

  return { enums, models };
}

function coerceScalarValue(raw: string, field: FieldInfo): unknown {
  const value = raw.trim();
  if (field.isEnum || field.type === 'String' || field.type === 'Bytes') {
    return value;
  }
  if (field.type === 'Boolean') {
    const normalized = value.toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n'].includes(normalized)) return false;
    throw new Error(`Invalid boolean value "${value}" for ${field.name}`);
  }
  if (field.type === 'Int') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid Int value "${value}" for ${field.name}`);
    }
    return parsed;
  }
  if (field.type === 'BigInt') {
    try {
      return BigInt(value);
    } catch {
      throw new Error(`Invalid BigInt value "${value}" for ${field.name}`);
    }
  }
  if (field.type === 'Float') {
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid Float value "${value}" for ${field.name}`);
    }
    return parsed;
  }
  if (field.type === 'Decimal') {
    return value;
  }
  if (field.type === 'DateTime') {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Invalid DateTime value "${value}" for ${field.name}`);
    }
    return parsed;
  }
  if (field.type === 'Json') {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`Invalid Json value "${value}" for ${field.name}`);
    }
  }
  return value;
}

function coerceValue(raw: string, field: FieldInfo): unknown {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return undefined;

  if (!field.isList) {
    return coerceScalarValue(trimmed, field);
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      throw new Error(`Expected array value for ${field.name}`);
    }
    return parsed.map((item) => {
      if (typeof item !== 'string') return item;
      return coerceScalarValue(item, {
        ...field,
        isList: false,
      });
    });
  }

  const separator = trimmed.includes('|')
    ? '|'
    : trimmed.includes(';')
      ? ';'
      : trimmed.includes(',')
        ? ','
        : null;
  const items = separator ? trimmed.split(separator) : [trimmed];
  return items
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) =>
      coerceScalarValue(item, {
        ...field,
        isList: false,
      }),
    );
}

async function readCsv(filePath: string): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];
    fs.createReadStream(filePath)
      .pipe(
        csvParser({
          mapHeaders: ({ header }: { header: string }) =>
            header?.trim?.().replace(/^\uFEFF/, '') ?? header,
          mapValues: ({ value }: { value: string }) =>
            typeof value === 'string' ? value.trim() : value,
        }),
      )
      .on('data', (row:any) => rows.push(row as CsvRow))
      .on('error', reject)
      .on('end', () => resolve(rows));
  });
}

async function seedFromCsv(modelName: string, csvPath: string): Promise<void> {
  const schemaPath = path.resolve(__dirname, 'schema.prisma');
  const schemaText = fs.readFileSync(schemaPath, 'utf-8');
  const { models } = parseSchema(schemaText);
  const fields = models[modelName];
  if (!fields) {
    const available = Object.keys(models).sort().join(', ');
    throw new Error(
      `Unknown model "${modelName}". Available models: ${available}`,
    );
  }

  const csvFilePath = path.resolve(process.cwd(), csvPath);
  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`CSV file not found at ${csvFilePath}`);
  }

  const scalarFields = fields.filter((field) => field.isScalar);
  const fieldMap = new Map(scalarFields.map((field) => [field.name, field]));
  const rows = await readCsv(csvFilePath);
  if (rows.length === 0) {
    console.log(`No rows found in ${csvFilePath}`);
    return;
  }

  const csvColumns = Object.keys(rows[0] ?? {});
  const unknownColumns = csvColumns.filter((column) => !fieldMap.has(column));
  if (unknownColumns.length > 0) {
    console.warn(
      `Ignoring unknown CSV columns: ${unknownColumns.join(', ')}`,
    );
  }

  const data = rows.map((row, index) => {
    const record: Record<string, unknown> = {};
    const missingRequired: string[] = [];
    for (const [fieldName, field] of fieldMap.entries()) {
      if (!(fieldName in row)) continue;
      const rawValue = row[fieldName];
      if (rawValue === undefined || rawValue === null || rawValue === '') {
        if (!field.isOptional && !field.hasDefault && !field.isList) {
          missingRequired.push(fieldName);
        }
        continue;
      }
      record[fieldName] = coerceValue(rawValue, field);
    }
    if (missingRequired.length > 0) {
      throw new Error(
        `Row ${index + 1} missing required fields: ${missingRequired.join(', ')}`,
      );
    }
    return record;
  });

  const clientKey = toClientKey(modelName);
  const delegate = (
    prisma as unknown as Record<
      string,
      {
        createMany: (args: {
          data: Record<string, unknown>[];
          skipDuplicates?: boolean;
        }) => Promise<unknown>;
      }
    >
  )[clientKey];
  if (!delegate || typeof delegate.createMany !== 'function') {
    throw new Error(
      `Prisma client does not expose model "${modelName}" as "${clientKey}"`,
    );
  }

  const skipDuplicates = process.argv.includes('--skip-duplicates');
  await delegate.createMany({ data, skipDuplicates });
  console.log(`Seeded ${data.length} ${modelName} records from CSV.`);
}

async function main() {
  console.log('🌱 Seeding database...');

  const csvModel = getArgValue('--model');
  const csvFile = getArgValue('--file');
  const withDefaults = process.argv.includes('--with-defaults');
  if (csvModel && csvFile) {
    await seedFromCsv(csvModel, csvFile);
    if (!withDefaults) {
      console.log('CSV seeding completed successfully');
      return;
    }
  }

  /* -------------------- CLUB -------------------- */
  const club = await prisma.clubs.create({
    data: {
      name: 'Zynvo Tech Club',
      founderEmail: 'founder@zynvo.com',
      facultyEmail: 'faculty@college.edu',
      collegeName: 'Zynvo University',
      collegeId: 'zynvo-college-001',
      type: 'Technology',
      description: 'Official tech & startup club of Zynvo University',
      clubContact: '+91 9876543210',
      wings: ['Web', 'AI', 'Design'],
      instagram: 'https://instagram.com/zynvo',
      linkedin: 'https://linkedin.com/company/zynvo',
    },
  });

  /* -------------------- USERS -------------------- */
  const founder = await prisma.user.create({
    data: {
      email: 'founder@zynvo.com',
      password: 'hashed_password',
      name: 'Rishiraj',
      collegeName: club.collegeName,
      clubId: club.id,
      clubName: club.name,
      expiryToken: 0,
      ValidFor: 0,
      isVerified: true,
      tags: ['Founder', 'Developer'],
    },
  });

  const member = await prisma.user.create({
    data: {
      email: 'member@zynvo.com',
      password: 'hashed_password',
      name: 'Demo Member',
      collegeName: club.collegeName,
      expiryToken: 0,
      ValidFor: 0,
      tags: ['Student'],
    },
  });

  /* -------------------- EVENT -------------------- */
  const event = await prisma.event.create({
    data: {
      EventName: 'Zynvo Hackathon 2025',
      description: '48-hour national level hackathon',
      clubName: club.name,
      clubId: club.id,
      university: club.collegeName,
      startDate: '2025-02-10',
      endDate: '2025-02-12',
      Venue: 'Main Auditorium',
      contactEmail: 'events@zynvo.com',
      TeamSize: 4,
    },
  });

  /* -------------------- SPEAKER -------------------- */
  await prisma.speakers.create({
    data: {
      name: 'John Doe',
      email: 'john@speaker.com',
      about: 'AI Researcher at Google',
      eventId: event.id,
    },
  });

  /* -------------------- EVENT GALLERY -------------------- */
  await prisma.eventGallery.createMany({
    data: [
      {
        imageUrl: 'https://picsum.photos/600/400',
        caption: 'Opening Ceremony',
        eventId: event.id,
      },
      {
        imageUrl: 'https://picsum.photos/600/401',
        caption: 'Team Work',
        eventId: event.id,
      },
    ],
  });

  /* -------------------- EVENT ANNOUNCEMENT -------------------- */
  await prisma.eventAnnouncement.create({
    data: {
      Title: 'Registrations Open',
      Description: 'Registrations are now live!',
      eventId: event.id,
    },
  });

  /* -------------------- CLUB ANNOUNCEMENT -------------------- */
  await prisma.clubAnnouncement.create({
    data: {
      Title: 'Welcome Freshers',
      Description: 'Join Zynvo Tech Club and build cool things!',
      clubId: club.id,
    },
  });

  /* -------------------- POST -------------------- */
  const post = await prisma.createPost.create({
    data: {
      title: 'Hackathon Announcement',
      description: 'Get ready for the biggest hackathon!',
      published: true,
      clubName: club.name,
      collegeName: club.collegeName,
      collegeId: club.collegeId,
      authorId: founder.id,
    },
  });

  /* -------------------- UPVOTE -------------------- */
  await prisma.postUpvote.create({
    data: {
      postId: post.id,
      userId: member.id,
    },
  });

  /* -------------------- EVENT JOIN -------------------- */
  await prisma.userEvents.create({
    data: {
      userId: member.id,
      eventId: event.id,
      uniquePassId: 'PASS-001',
    },
  });

  console.log('✅ Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
