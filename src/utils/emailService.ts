import mail from './nodemailer';
import { emailTemplates } from './emailTemplates';

export const emailService = {
  generateVerificationUrl: (token: string, email: string): string => {
    return `https://zynvo.social/verification-mail?token=${token}&email=${email}`;
  },

  sendVerificationEmail: async (name: string, email: string, token: string): Promise<void> => {
    const verificationUrl = emailService.generateVerificationUrl(token, email);
    const htmlContent = emailTemplates.verification(name, verificationUrl);
    
    await mail(
      name,
      email,
      'Verify your Zynvo account',
      htmlContent
    );
  },

  sendResendVerificationEmail: async (name: string, email: string, token: string): Promise<void> => {
    const verificationUrl = emailService.generateVerificationUrl(token, email);
    const htmlContent = emailTemplates.resendVerification(name, verificationUrl);
    
    await mail(
      name,
      email,
      'Resend: Verify your Zynvo account',
      htmlContent
    );
  }
};
