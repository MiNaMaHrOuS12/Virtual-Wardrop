import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

// The owner's email where booking notifications will be sent
const OWNER_EMAIL = 'minamahrous524@gmail.com';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true
  }
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
    
    // Store booking data even if email fails
    console.log('Booking data received:', bookingData);
    
    // Check credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return res.status(200).json({ 
        message: 'Booking received. Email sending skipped - credentials not configured.',
        success: true
      });
    }
    
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      res.status(200).json({ 
        message: 'Booking confirmation email sent successfully',
        success: true 
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Still return success since we received the booking
      res.status(200).json({
        message: 'Booking received but email notification failed',
        success: true,
        emailError: emailError.message
      });
    }
  } catch (error) {
    console.error('Booking processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process booking request',
      details: error.message
    });
  }
};