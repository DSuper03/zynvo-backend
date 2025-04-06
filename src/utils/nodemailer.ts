import node from "nodemailer"


export default async function mail(email : string, subject : string, html : string) {
    try {
        const transporter = node.createTransport({
          host: process.env.SMTP_HOST, 
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: false, 
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS, 
          },
        });
    
        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM, 
          to: email,
          subject,
          html,
        });
    
        console.log("Email sent successfully:", info);
      } catch (error) {
        console.error("Error sending email:", error);
      }
}