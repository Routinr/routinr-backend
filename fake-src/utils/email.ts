import nodemailer from 'nodemailer';

const emailPass = process.env.EMAIL_PASS || 'OPxNtKJ6U1y9sc5Y';

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        debug: true,
        logger: true,
        auth: {
            user: "alexindevs@gmail.com",
            pass: emailPass,
        },
        tls: {
            rejectUnauthorized: false
        }
      });

      console.log("Everything's good till here.")
    
      const mailOptions = {
            from: 'alexindevs@gmail.com',
            to,
            subject,
            text: "",
            html: html || "",
      };
      console.log(mailOptions.from, mailOptions.html, mailOptions.subject, mailOptions.to)

      console.log("Before suspect:")
      const info = await transporter.sendMail(mailOptions);
      console.log("After suspect.")
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }
  }
  