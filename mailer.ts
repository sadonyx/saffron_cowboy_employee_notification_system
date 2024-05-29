import nodemailer from 'nodemailer';
import config from "./config/config"

export interface Info {
  messageId?: number;
  envelope?: Object;
  accepted?: Array<string>;
  rejected?: Array<string>;
  pending?: Array<string>;
  response?: string;
}

export interface mailOptions {
  readonly from: 'notifications@saffroncowboy.com';
  to: string;
  subject: string;
  html: string;
}

// Create a transporter object
export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.senderEmail,
    pass: config.senderPass,
  }
});