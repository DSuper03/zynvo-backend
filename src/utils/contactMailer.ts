import sgMail from '@sendgrid/mail';
import { SENDGRID_CONTACT_FROM } from '../config';

const Api_key = process.env.SENDGRID_API_KEY as string;

export default async function cmail(
  name: string | null,
  email: string,
  subject: string,
  html: string
) {
  sgMail.setApiKey(Api_key);
  const msg = {
    from: SENDGRID_CONTACT_FROM, 
    to: 'Dsuper03.dev@gmail.com', 
    subject: subject,
    text: `Zynvo it.`,
    html: html,
  };

  const response = await sgMail.send(msg);

  if (response) {
    console.log('Sent email');
    return true;
  } else {
    console.log('some error occured');
    return false;
  }
}