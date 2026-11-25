/**
 * Question bank for Campus Drop, used in order (one per day, then repeats).
 * Keep them light: no politics, religion, or anything about a real person.
 * `teaser` is the push notification body, so it hints without giving it away.
 */

export type DropQuestion = {
  question: string;
  options: string[];
  teaser: string;
};

export const DROP_QUESTIONS: readonly DropQuestion[] = [
  { question: 'Maggi at 2 AM or chai at 6 AM?', options: ['Maggi at 2 AM', 'Chai at 6 AM'], teaser: "Today's question is about your hostel nights 👀" },
  { question: 'A two-hour gap between lectures is…', options: ['A gift', 'A curse'], teaser: 'Your timetable is on trial today ⏳' },
  { question: 'Front bench or last bench?', options: ['Front bench', 'Last bench', 'Wherever my friends are'], teaser: 'Where you sit says a lot. Prove it 🪑' },
  { question: 'Should attendance be optional?', options: ['Yes, fully', 'Only above 75% CGPA', 'No, keep it'], teaser: 'A hot take about attendance just dropped 🔥' },
  { question: 'Best canteen order?', options: ['Samosa', 'Maggi', 'Vada pav', 'Cold coffee'], teaser: 'The canteen debate is open. Pick a side 🍽️' },
  { question: 'Group projects are…', options: ['Fun with the right people', 'One person doing everything', 'Pure chaos'], teaser: 'Everyone has a group project story 👥' },
  { question: 'Night before the exam, you are…', options: ['Calmly revising', 'Watching one-shot videos', 'Starting the syllabus'], teaser: 'Be honest about exam night 📚' },
  { question: 'Fest season: what are you there for?', options: ['The concert', 'The competitions', 'The food stalls', 'Just vibes'], teaser: 'Fest season question. Your campus is answering 🎉' },
  { question: 'Hostel food rating this week?', options: ['Surprisingly good', 'Edible', "Don't ask"], teaser: 'Rate this week, anonymously 🍛' },
  { question: 'Would you rather have an 8 AM class or a 6 PM class?', options: ['8 AM', '6 PM'], teaser: "There's no right answer, only your answer ⏰" },
  { question: 'Best place to study on campus?', options: ['Library', 'Hostel room', 'Canteen', 'An empty classroom'], teaser: "Where does your campus actually study? 📖" },
  { question: 'Your phone battery right now?', options: ['Above 80%', '30-80%', 'Below 30%', 'Charging'], teaser: 'Quick one. Check your phone 🔋' },
  { question: 'Coding contest or quiz night?', options: ['Coding contest', 'Quiz night'], teaser: 'Two kinds of people on campus. Which are you? 🧠' },
  { question: 'Ideal Saturday?', options: ['Sleep till noon', 'Trip with friends', 'Hackathon', 'Catch up on shows'], teaser: 'Plan your Saturday in one tap 🗓️' },
  { question: 'Who reaches class last?', options: ['Hostellers', 'Day scholars', 'Equal, honestly'], teaser: "Hostellers vs day scholars. It's on 🏃" },
  { question: 'Best way to make friends in first year?', options: ['Clubs', 'Hostel wing', 'Classmates', 'Fests'], teaser: 'Seniors know the answer to this one 🤝' },
  { question: 'Which semester was the hardest?', options: ['First', 'Second', 'Third or fourth', 'The current one'], teaser: "Let's settle which semester hurt the most 😮‍💨" },
  { question: 'Notes: handwritten or on the laptop?', options: ['Handwritten', 'Laptop', 'Photos of the board'], teaser: 'How does your campus take notes? ✍️' },
  { question: 'Would you join a club just for the certificate?', options: ['Yes', 'No', 'Already did'], teaser: 'A slightly spicy one about clubs 🌶️' },
  { question: 'Placement prep starts in…', options: ['First year', 'Second year', 'Third year', 'The week before'], teaser: "Placement question. Everyone's lying a bit 💼" },
  { question: 'Best study break?', options: ['Reels', 'A walk', 'Tea', 'A nap that becomes 3 hours'], teaser: 'Your study break is being judged 😴' },
  { question: 'Campus wifi today?', options: ['Fast', 'Works sometimes', 'What wifi?'], teaser: 'The wifi question. Vent here 📶' },
  { question: 'Open mic: would you go on stage?', options: ['Already have', 'If friends push me', 'Never'], teaser: 'Stage or audience? Today we find out 🎤' },
  { question: 'Cricket or football on campus?', options: ['Cricket', 'Football', 'Badminton', 'None, I watch'], teaser: 'The sports question your campus will fight over ⚽' },
  { question: 'Fastest way across campus?', options: ['Walk', 'Cycle', "Friend's scooter", 'I just skip it'], teaser: 'How does your campus get around? 🚲' },
  { question: 'Which app do you open first in the morning?', options: ['WhatsApp', 'Instagram', 'YouTube', 'Alarm, then sleep again'], teaser: 'Your first app of the day says everything ☀️' },
  { question: 'Best fest event?', options: ['Battle of bands', 'Hackathon', 'Fashion show', 'Dance face-off'], teaser: 'Every campus has a favourite fest event 🎸' },
  { question: 'How many unread messages in your class group?', options: ['Zero', 'Under 50', 'Under 500', 'Muted forever'], teaser: 'Check your class group. We will wait 💬' },
  { question: 'Would you rather work on a side project or an internship this summer?', options: ['Side project', 'Internship', 'Both', 'Neither, I am resting'], teaser: 'Summer plans question. Be real ☀️' },
  { question: 'Assignment deadline is at midnight. You submit at…', options: ['A day early', 'Around 10 PM', '11:59 PM', '12:01 AM, sorry'], teaser: "Deadline habits. Nobody's judging (we are) ⏱️" },
  { question: 'Lift or stairs?', options: ['Lift, always', 'Stairs', 'Depends on the queue'], teaser: 'The smallest debate on campus. Still a debate 🛗' },
  { question: 'Best snack during a lecture?', options: ['Chips', 'Biscuits', 'Nothing, I am focused', 'Something I should not be eating'], teaser: 'What is in your bag right now? 🍪' },
  { question: 'Which club would you start if you could?', options: ['Gaming', 'Food reviews', 'Film', 'Startup'], teaser: 'Imagine starting your own club 🚀' },
  { question: 'Exam result day, you…', options: ['Check instantly', 'Wait for friends', 'Let parents check', 'Never look'], teaser: 'Result-day energy. Pick one 📈' },
  { question: 'Best time to go to the library?', options: ['Morning', 'Afternoon', 'Right before it closes', 'During exams only'], teaser: 'Library people, this one is for you 📚' },
  { question: 'Best seat in the bus on a college trip?', options: ['Window', 'Last row', 'Front, near the music', 'Anywhere I can sleep'], teaser: 'The college trip question 🚌' },
  { question: 'Rain on campus means…', options: ['Chai and pakoras', 'Bunking class', 'Wet shoes, sad day'], teaser: 'Monsoon mood check 🌧️' },
  { question: 'Hardest part of college?', options: ['Attendance', 'Exams', 'Waking up', 'Making friends'], teaser: 'The honest question of the week 🫠' },
  { question: 'Your dream job right now?', options: ['Big tech', 'Startup', 'Government job', 'My own thing'], teaser: 'What is your campus dreaming about? 💭' },
  { question: 'Mess or outside food?', options: ['Mess', 'Outside', 'Whatever is cheaper'], teaser: 'The food budget question 💸' },
  { question: 'How many hours did you sleep last night?', options: ['Under 5', '5-7', '7-9', 'More than 9'], teaser: 'Sleep check. Your campus vs everyone 😴' },
  { question: 'Best place for a birthday treat?', options: ['Canteen', 'Nearby cafe', 'Hostel room', 'Outside city trip'], teaser: 'Birthday treat rules are up for debate 🎂' },
];
