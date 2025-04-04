import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

// The owner's email where booking notifications will be sent
const OWNER_EMAIL = 'minamahrous524@gmail.com';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

interface BookingData {
  companyName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  companySize: string;
  preferredDate: Date;
  timeZone: string;
  preferredTime: string;
  message?: string;
  services?: string[];
}

export const sendBookingConfirmation = async (req: Request, res: Response) => {
  try {
    const bookingData: BookingData = req.body;
    
    if (!bookingData) {
      return res.status(400).json({ error: 'No booking data provided' });
    }
    
    // Format the date for better readability
    const formattedDate = new Date(bookingData.preferredDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Create HTML content for the email
    const servicesHtml = bookingData.services && bookingData.services.length > 0 
      ? `<p><strong>Selected Services:</strong><br>${bookingData.services.join('<br>')}</p>` 
      : '';
      
    const messageHtml = bookingData.message 
      ? `<p><strong>Additional Message:</strong><br>${bookingData.message}</p>` 
      : '';
    
    const htmlContent = `
      <h2>New Meeting Request</h2>
      <p>You have received a new personalized pricing consultation request from ${bookingData.companyName}.</p>
      
      <h3>Company Details</h3>
      <p><strong>Company Name:</strong> ${bookingData.companyName}</p>
      <p><strong>Company Size:</strong> ${bookingData.companySize}</p>
      
      <h3>Contact Information</h3>
      <p><strong>Contact Name:</strong> ${bookingData.contactName}</p>
      <p><strong>Email:</strong> ${bookingData.email}</p>
      <p><strong>Phone:</strong> ${bookingData.phoneNumber}</p>
      
      <h3>Meeting Details</h3>
      <p><strong>Preferred Date:</strong> ${formattedDate}</p>
      <p><strong>Preferred Time:</strong> ${bookingData.preferredTime}</p>
      <p><strong>Time Zone:</strong> ${bookingData.timeZone}</p>
      
      ${servicesHtml}
      ${messageHtml}
      
      <p>Please respond to this inquiry within 24 hours.</p>
    `;
    
    // Send email to the owner
    const mailOptions = {
      from: '"3D Virtual Try-On Platform" <noreply@virtualtryonplatform.com>',
      to: OWNER_EMAIL,
      subject: `New Meeting Request: ${bookingData.companyName}`,
      html: htmlContent,
    };
    
    // Only attempt to send if we have credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email credentials not provided. Email would have been sent with the following content:');
      console.log(htmlContent);
      return res.status(200).json({ 
        message: 'Email credentials not found. Email would have been sent in production.',
        preview: htmlContent
      });
    }
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
    res.status(200).json({ message: 'Booking confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    // For development, still return 200 if credentials are missing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return res.status(200).json({ 
        message: 'Development mode: Email would have been sent in production',
        preview: htmlContent
      });
    }
    res.status(500).json({ 
      error: 'Failed to send booking confirmation email',
      details: error.message 
    });
  }
};