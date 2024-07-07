import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'Add email',
        pass: 'password',
      },
    });

    await transporter.sendMail({
      from: '"turki" <Add Email>',
      to,
      subject,
      html,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};