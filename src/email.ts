import { prisma } from '../src/db/db'

async function  getAllUserEmails() {   
const emails = await prisma.user.findMany({
  select: { email: true },
}) }

getAllUserEmails().then((emails) => {
  console.log('User Emails:', emails);
}).catch((error) => {
  console.error('Error fetching user emails:', error);
}).finally(async () => {
  await prisma.$disconnect();
});