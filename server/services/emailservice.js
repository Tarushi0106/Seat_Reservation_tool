const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password
  }
});

const sendBookingConfirmation = async (to, date, startTime, endTime) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Seat Booking Confirmation',
    text: `Your seat has been successfully booked for the following details:\n\nDate: ${date}\nTime: ${startTime} to ${endTime}.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending booking confirmation email:', error.message);
    throw error; // Re-throw the error to handle it in the controller
  }
};

module.exports = { sendBookingConfirmation };