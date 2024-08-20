import nodemailer from 'nodemailer';

// Configure the transporter using your Elastic Email credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 2525, // You can also use 587 or 465 depending on your preference
  auth: {
    user: 'darkiideas@gmail.com', // Your Elastic Email account email
    pass: '63DFDB4A6BCCA73C512D18C1AF01DBB46BAC', // Your Elastic Email API key
  },
});

// Function to send a password reset email
export async function sendResetEmail(email: string, token: string) {
  const resetToken = `$token=${token}`;

  const mailOptions = {
    from: 'darkiideas@gmail.com', // Sender address (your Elastic Email account email)
    to: email, // Recipient's email address
    subject: 'Password Reset Request', // Subject line
    html: `<p>You requested a password reset. Copy below token and paste to reset your password:</p>
    
           <h1>${resetToken}</h1>`, // HTML body of the email
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}
