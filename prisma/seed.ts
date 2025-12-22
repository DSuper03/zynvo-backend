import { prisma } from '../src/db/db';

async function main() {
  console.log('🌱 Seeding database...');

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
