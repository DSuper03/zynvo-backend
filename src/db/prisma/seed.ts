import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.userEvents.deleteMany({});
  await prisma.speakers.deleteMany({});
  await prisma.createPost.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.clubs.deleteMany({});

  const techClub = await prisma.clubs.create({
    data: {
      name: 'Tech Innovators',
      founderEmail: 'founder@techinnovators.com',
      facultyEmail: 'faculty@college.edu',
      collegeName: 'Sample College',
      type: 'Technology',
      description: 'A club for technology enthusiasts and innovators',
      clubContact: '+1234567890',
      profilePicUrl: 'https://example.com/tech-club.jpg',
    },
  });

  const culturalClub = await prisma.clubs.create({
    data: {
      name: 'Cultural Vista',
      founderEmail: 'founder@culturalvista.com',
      facultyEmail: 'faculty2@college.edu',
      collegeName: 'Sample College',
      type: 'Cultural',
      description: 'Celebrating diversity through cultural activities',
      clubContact: '+1234567891',
      profilePicUrl: 'https://example.com/cultural-club.jpg',
    },
  });

  const hashedPassword = await hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      password: hashedPassword,
      collegeName: 'Sample College',
      profileAvatar: 'https://example.com/avatar1.jpg',
      expiryToken: 123456,
      ValidFor: 3600,
      isVerified: true,
      clubId: techClub.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
      collegeName: 'Sample College',
      profileAvatar: 'https://example.com/avatar2.jpg',
      expiryToken: 123456,
      ValidFor: 3600,
      isVerified: true,
      clubId: culturalClub.id,
    },
  });

  const techEvent = await prisma.event.create({
    data: {
      EventName: 'Hackathon 2024',
      description: 'Annual 24-hour coding competition',
      prizes: '1st Prize: $1000, 2nd Prize: $500',
      clubName: techClub.name,
      clubId: techClub.id,
      endDate: new Date('2024-12-31'),
      eventHeaderImage: 'https://example.com/hackathon.jpg',
    },
  });

  await prisma.speakers.create({
    data: {
      name: 'Dr. Tech Expert',
      email: 'expert@tech.com',
      profilePic: 'https://example.com/speaker1.jpg',
      eventId: techEvent.id,
    },
  });

  await prisma.createPost.create({
    data: {
      title: 'Upcoming Hackathon',
      description: 'Join us for the biggest hackathon of the year!',
      image: 'https://example.com/hackathon-post.jpg',
      published: true,
      collegeId: techClub.collegeId,
      authorId: user1.id,
    },
  });

  await prisma.userEvents.create({
    data: {
      userId: user2.id,
      eventId: techEvent.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
