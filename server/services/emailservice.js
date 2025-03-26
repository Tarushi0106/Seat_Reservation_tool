const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password
  }
});

const sendBookingConfirmation = async (to, seatnumber) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Seat Booking Confirmation',
    text: `Your seat number ${seatnumber} has been successfully booked.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error; // Re-throw the error to handle it in the controller
  }
};

module.exports = { sendBookingConfirmation };