import sgMail from '@sendgrid/mail';

const Api_key = process.env.SENDGRID_API_KEY as string;

export default async function mail(
  name: string,
  email: string,
  subject: string,
  html: string
) {
  sgMail.setApiKey(Api_key);
  const msg = {
    to: email, // Change to your recipient
    from: 'dsuper03@zynvo.social', // Change to your verified sender
    subject: subject,
    text: `Zynvo it.`,
    html: html,
  };

  const response = await sgMail.send(msg);

  if (response) {
    console.log('Sent email');
    return true
  } else {
    console.log('some error occured');
    return false
  }
}
