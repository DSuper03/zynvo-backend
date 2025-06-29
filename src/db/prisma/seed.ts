// import { clubType } from '@prisma/client' 
import { hash } from 'bcryptjs'
import prisma from '../db'


// enum clubType  {
//   Technology, 
//   Cultural,
//   Business,
//   Social,
//   Literature,
//   Design,
//   General,
// }

async function main() {
  console.log('Starting database seeding...')

  // Clear existing data
  await prisma.userEvents.deleteMany()
  await prisma.speakers.deleteMany()
  await prisma.createPost.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()
  await prisma.clubs.deleteMany()

  // Hash password for all users
  const hashedPassword = await hash('password123', 12)

  // Create colleges/universities
  const colleges = [
    'MIT - Massachusetts Institute of Technology',
    'Stanford University',
    'Harvard University',
    'University of California Berkeley',
    'Carnegie Mellon University',
    'Indian Institute of Technology Delhi',
    'Indian Institute of Technology Bombay',
    'University of Oxford',
    'University of Cambridge',
    'Georgia Institute of Technology'
  ]

  // Create clubs
  const clubsData = [
    {
      name: 'Tech Innovators',
      founderEmail: 'founder1@mit.edu',
      coremember1: 'core1@mit.edu',
      coremember2: 'core2@mit.edu',
      coremember3: 'core3@mit.edu',
      facultyEmail: 'faculty1@mit.edu',
      collegeName: colleges[0],
      type: "Technology",
      description: 'A club dedicated to exploring cutting-edge technologies and fostering innovation among students.',
      requirements: 'Basic programming knowledge, passion for technology',
      profilePicUrl: 'https://example.com/tech-innovators.jpg',
      clubContact: '+1-555-0101'
    },
    {
      name: 'Cultural Society',
      founderEmail: 'founder2@stanford.edu',
      coremember1: 'core4@stanford.edu',
      coremember2: 'core5@stanford.edu',
      facultyEmail: 'faculty2@stanford.edu',
      collegeName: colleges[1],
      type: "Cultural",
      description: 'Celebrating diversity and promoting cultural exchange through various events and activities.',
      requirements: 'Open to all students interested in cultural activities',
      profilePicUrl: 'https://example.com/cultural-society.jpg',
      clubContact: '+1-555-0102'
    },
    {
      name: 'Entrepreneurship Hub',
      founderEmail: 'founder3@harvard.edu',
      coremember1: 'core6@harvard.edu',
      coremember2: 'core7@harvard.edu',
      coremember3: 'core8@harvard.edu',
      facultyEmail: 'faculty3@harvard.edu',
      collegeName: colleges[2],
      type: "Business",
      description: 'Supporting aspiring entrepreneurs with resources, mentorship, and networking opportunities.',
      requirements: 'Interest in entrepreneurship and business development',
      profilePicUrl: 'https://example.com/entrepreneurship-hub.jpg',
      clubContact: '+1-555-0103'
    },
    {
      name: 'Literary Circle',
      founderEmail: 'founder4@berkeley.edu',
      coremember1: 'core9@berkeley.edu',
      coremember2: 'core10@berkeley.edu',
      facultyEmail: 'faculty4@berkeley.edu',
      collegeName: colleges[3],
      type: "Literature",
      description: 'A community for book lovers, writers, and literature enthusiasts.',
      requirements: 'Love for reading and writing',
      profilePicUrl: 'https://example.com/literary-circle.jpg',
      clubContact: '+1-555-0104'
    },
    {
      name: 'Design Studio',
      founderEmail: 'founder5@cmu.edu',
      coremember1: 'core11@cmu.edu',
      coremember2: 'core12@cmu.edu',
      coremember3: 'core13@cmu.edu',
      facultyEmail: 'faculty5@cmu.edu',
      collegeName: colleges[4],
      type: "Design",
      description: 'Exploring the intersection of art, technology, and human-centered design.',
      requirements: 'Portfolio submission, design fundamentals knowledge',
      profilePicUrl: 'https://example.com/design-studio.jpg',
      clubContact: '+1-555-0105'
    },
    {
      name: 'Social Impact Network',
      founderEmail: 'founder6@iitd.ac.in',
      coremember1: 'core14@iitd.ac.in',
      coremember2: 'core15@iitd.ac.in',
      facultyEmail: 'faculty6@iitd.ac.in',
      collegeName: colleges[5],
      type: "Social",
      description: 'Working towards creating positive social change through community service and advocacy.',
      requirements: 'Commitment to social causes and community service',
      profilePicUrl: 'https://example.com/social-impact.jpg',
      clubContact: '+91-555-0106'
    }
  ]

  const createdClubs = []
  for (const clubData of clubsData) {
    const club = await prisma.clubs.create({
      data: clubData
    })
    createdClubs.push(club)
  }

  console.log('Created clubs:', createdClubs.length)

  // Create users
  const usersData = [
    {
      email: 'founder1@mit.edu',
      name: 'John Smith',
      collegeName: colleges[0],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Tech Innovators',
      clubId: createdClubs[0].id,
      profileAvatar: 'https://example.com/avatars/john.jpg',
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    },
    {
      email: 'founder2@stanford.edu',
      name: 'Emily Johnson',
      collegeName: colleges[1],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Cultural Society',
      clubId: createdClubs[1].id,
      profileAvatar: 'https://example.com/avatars/emily.jpg',
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    },
    {
      email: 'founder3@harvard.edu',
      name: 'Michael Brown',
      collegeName: colleges[2],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Entrepreneurship Hub',
      clubId: createdClubs[2].id,
      profileAvatar: 'https://example.com/avatars/michael.jpg',
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    },
    {
      email: 'founder4@berkeley.edu',
      name: 'Sarah Davis',
      collegeName: colleges[3],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Literary Circle',
      clubId: createdClubs[3].id,
      profileAvatar: 'https://example.com/avatars/sarah.jpg',
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    },
    {
      email: 'founder5@cmu.edu',
      name: 'David Wilson',
      collegeName: colleges[4],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Design Studio',
      clubId: createdClubs[4].id,
      profileAvatar: 'https://example.com/avatars/david.jpg',
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    },
    {
      email: 'founder6@iitd.ac.in',
      name: 'Priya Sharma',
      collegeName: colleges[5],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Social Impact Network',
      clubId: createdClubs[5].id,
      profileAvatar: 'https://example.com/avatars/priya.jpg',
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    }
  ]

  // Add regular members
  const regularMembers = [
    {
      email: 'alice@mit.edu',
      name: 'Alice Cooper',
      collegeName: colleges[0],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Tech Innovators',
      clubId: createdClubs[0].id,
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    },
    {
      email: 'bob@stanford.edu',
      name: 'Bob Martin',
      collegeName: colleges[1],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Cultural Society',
      clubId: createdClubs[1].id,
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    },
    {
      email: 'charlie@harvard.edu',
      name: 'Charlie Thompson',
      collegeName: colleges[2],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Entrepreneurship Hub',
      clubId: createdClubs[2].id,
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    },
    {
      email: 'diana@berkeley.edu',
      name: 'Diana Prince',
      collegeName: colleges[3],
      password: hashedPassword,
      isVerified: true,
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    },
    {
      email: 'eve@cmu.edu',
      name: 'Eve Adams',
      collegeName: colleges[4],
      password: hashedPassword,
      isVerified: true,
      clubName: 'Design Studio',
      clubId: createdClubs[4].id,
      expiryToken: Math.floor((Date.now() + 3600000) / 1000),
      ValidFor: 3600
    }
  ]

  const allUsers = [...usersData, ...regularMembers]
  const createdUsers = []
  
  for (const userData of allUsers) {
    const user = await prisma.user.create({
      data: userData
    })
    createdUsers.push(user)
  }

  console.log('Created users:', createdUsers.length)

  // Create events
  const eventsData = [
    {
      EventName: 'AI Workshop 2025',
      description: 'Hands-on workshop covering machine learning fundamentals and practical applications.',
      posterUrl: 'https://example.com/posters/ai-workshop.jpg',
      EventMode: 'Hybrid',
      EventType: 'Workshop',
      eventHeaderImage: 'https://example.com/headers/ai-workshop.jpg',
      prizes: 'Certificates and internship opportunities',
      TeamSize: 1,
      Venue: 'MIT Tech Center, Room 101',
      EventUrl: 'https://mit.edu/ai-workshop',
      applicationStatus: 'open',
      clubName: createdClubs[0].name,
      clubId: createdClubs[0].id,
      university: colleges[0],
      startDate: '2025-07-15',
      endDate: '2025-07-17',
      collegeStudentsOnly: false,
      participationFee: true,
      contactEmail: 'contact@ai-workshop.com',
      contactPhone: 5550101
    },
    {
      EventName: 'Cultural Fest 2025',
      description: 'Annual cultural festival celebrating diversity with music, dance, and art performances.',
      posterUrl: 'https://example.com/posters/cultural-fest.jpg',
      EventMode: 'Offline',
      EventType: 'Festival',
      eventHeaderImage: 'https://example.com/headers/cultural-fest.jpg',
      prizes: 'Trophies and cash prizes worth $5000',
      TeamSize: 5,
      Venue: 'Stanford Main Auditorium',
      applicationStatus: 'open',
      clubName: createdClubs[1].name,
      clubId: createdClubs[1].id,
      university: colleges[1],
      startDate: '2025-08-20',
      endDate: '2025-08-22',
      collegeStudentsOnly: true,
      participationFee: false,
      contactEmail: 'cultural@stanford.edu',
      contactPhone: 5550102
    },
    {
      EventName: 'Startup Pitch Competition',
      description: 'Compete with innovative startup ideas and win funding opportunities.',
      posterUrl: 'https://example.com/posters/startup-pitch.jpg',
      EventMode: 'Hybrid',
      EventType: 'Competition',
      eventHeaderImage: 'https://example.com/headers/startup-pitch.jpg',
      prizes: 'Seed funding up to $50,000',
      TeamSize: 4,
      Venue: 'Harvard Business School',
      EventUrl: 'https://harvard.edu/startup-pitch',
      applicationStatus: 'open',
      clubName: createdClubs[2].name,
      clubId: createdClubs[2].id,
      university: colleges[2],
      startDate: '2025-09-10',
      endDate: '2025-09-11',
      collegeStudentsOnly: false,
      participationFee: true,
      contactEmail: 'pitch@harvard.edu',
      contactPhone: 5550103
    },
    {
      EventName: 'Poetry Reading Night',
      description: 'An evening of poetry readings, open mic, and literary discussions.',
      posterUrl: 'https://example.com/posters/poetry-night.jpg',
      EventMode: 'Offline',
      EventType: 'Literary Event',
      eventHeaderImage: 'https://example.com/headers/poetry-night.jpg',
      prizes: 'Published anthology featuring best poems',
      TeamSize: 1,
      Venue: 'Berkeley Library Auditorium',
      applicationStatus: 'open',
      clubName: createdClubs[3].name,
      clubId: createdClubs[3].id,
      university: colleges[3],
      startDate: '2025-07-25',
      collegeStudentsOnly: true,
      participationFee: false,
      contactEmail: 'poetry@berkeley.edu'
    },
    {
      EventName: 'Design Thinking Workshop',
      description: 'Learn design thinking methodologies and apply them to real-world problems.',
      posterUrl: 'https://example.com/posters/design-thinking.jpg',
      EventMode: 'Online',
      EventType: 'Workshop',
      eventHeaderImage: 'https://example.com/headers/design-thinking.jpg',
      prizes: 'Design toolkit and mentorship sessions',
      TeamSize: 3,
      EventUrl: 'https://cmu.edu/design-thinking',
      applicationStatus: 'open',
      clubName: createdClubs[4].name,
      clubId: createdClubs[4].id,
      university: colleges[4],
      startDate: '2025-08-05',
      endDate: '2025-08-07',
      collegeStudentsOnly: false,
      participationFee: true,
      contactEmail: 'design@cmu.edu',
      contactPhone: 5550105
    }
  ]

  const createdEvents = []
  for (const eventData of eventsData) {
    const event = await prisma.event.create({
      data: eventData
    })
    createdEvents.push(event)
  }

  console.log('Created events:', createdEvents.length)

  // Create speakers
  const speakersData = [
    {
      name: 'Dr. Andrew Ng',
      email: 'andrew.ng@stanford.edu',
      about: 'AI researcher and entrepreneur, co-founder of Coursera and former director of Stanford AI Lab.',
      profilePic: 'https://example.com/speakers/andrew-ng.jpg',
      eventId: createdEvents[0].id
    },
    {
      name: 'Sundar Pichai',
      email: 'sundar@google.com',
      about: 'CEO of Alphabet Inc. and Google, leading technology innovation globally.',
      profilePic: 'https://example.com/speakers/sundar-pichai.jpg',
      eventId: createdEvents[0].id
    },
    {
      name: 'Melinda French Gates',
      email: 'melinda@pivotalventures.org',
      about: 'Philanthropist and advocate for women and families, co-founder of Gates Foundation.',
      profilePic: 'https://example.com/speakers/melinda-gates.jpg',
      eventId: createdEvents[2].id
    },
    {
      name: 'Maya Angelou Jr.',
      email: 'maya@poetryinstitute.org',
      about: 'Contemporary poet and literary critic, following the legacy of her renowned mother.',
      profilePic: 'https://example.com/speakers/maya-angelou-jr.jpg',
      eventId: createdEvents[3].id
    },
    {
      name: 'Jony Ive',
      email: 'jony@lovefrom.com',
      about: 'Former Chief Design Officer at Apple, founder of LoveFrom design collective.',
      profilePic: 'https://example.com/speakers/jony-ive.jpg',
      eventId: createdEvents[4].id
    }
  ]

  for (const speakerData of speakersData) {
    await prisma.speakers.create({
      data: speakerData
    })
  }

  console.log('Created speakers:', speakersData.length)

  // Create posts
  const postsData = [
    {
      title: 'Welcome to Tech Innovators!',
      description: 'Join us as we explore the future of technology. Our club is dedicated to fostering innovation and creating solutions for tomorrow\'s challenges.',
      image: 'https://example.com/posts/welcome-tech.jpg',
      published: true,
      collegeId: createdClubs[0].collegeId,
      authorId: createdUsers[0].id
    },
    {
      title: 'Cultural Diversity Workshop',
      description: 'Learn about different cultures and traditions from around the world. This workshop will help you understand and appreciate cultural diversity.',
      image: 'https://example.com/posts/cultural-workshop.jpg',
      published: true,
      collegeId: createdClubs[1].collegeId,
      authorId: createdUsers[1].id
    },
    {
      title: 'Entrepreneurship 101',
      description: 'Basic principles of starting your own business. From idea validation to funding, we cover everything you need to know.',
      image: 'https://example.com/posts/entrepreneurship-101.jpg',
      published: true,
      collegeId: createdClubs[2].collegeId,
      authorId: createdUsers[2].id
    },
    {
      title: 'Book Club: Reading Schedule',
      description: 'This month we are reading "The Great Gatsby" by F. Scott Fitzgerald. Join our discussions every Friday at 5 PM.',
      image: 'https://example.com/posts/book-club.jpg',
      published: true,
      collegeId: createdClubs[3].collegeId,
      authorId: createdUsers[3].id
    },
    {
      title: 'UI/UX Design Principles',
      description: 'Learn the fundamental principles of user interface and user experience design. Create designs that users love.',
      image: 'https://example.com/posts/ui-ux-design.jpg',
      published: true,
      collegeId: createdClubs[4].collegeId,
      authorId: createdUsers[4].id
    }
  ]

  for (const postData of postsData) {
    await prisma.createPost.create({
      data: postData
    })
  }

  console.log('Created posts:', postsData.length)

  // Create user events (event registrations)
  const userEventsData = [
    {
      userId: createdUsers[0].id,
      eventId: createdEvents[0].id,
      uniquePassId: 'PASS-001'
    },
    {
      userId: createdUsers[1].id,
      eventId: createdEvents[1].id,
      uniquePassId: 'PASS-002'
    },
    {
      userId: createdUsers[2].id,
      eventId: createdEvents[2].id,
      uniquePassId: 'PASS-003'
    },
    {
      userId: createdUsers[3].id,
      eventId: createdEvents[3].id,
      uniquePassId: 'PASS-004'
    },
    {
      userId: createdUsers[4].id,
      eventId: createdEvents[4].id,
      uniquePassId: 'PASS-005'
    },
    {
      userId: createdUsers[6].id, // Alice attending AI Workshop
      eventId: createdEvents[0].id,
      uniquePassId: 'PASS-006'
    },
    {
      userId: createdUsers[7].id, // Bob attending Cultural Fest
      eventId: createdEvents[1].id,
      uniquePassId: 'PASS-007'
    },
    {
      userId: createdUsers[8].id, // Charlie attending Startup Pitch
      eventId: createdEvents[2].id,
      uniquePassId: 'PASS-008'
    }
  ]

  for (const userEventData of userEventsData) {
    await prisma.userEvents.create({
      data: userEventData
    })
  }

  console.log('Created user events:', userEventsData.length)

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })