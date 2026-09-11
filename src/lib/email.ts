import nodemailer from "nodemailer";
import { BRAND } from "./constants";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_APP_PASSWORD);
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Email not configured, skipping send");
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"${BRAND.name}" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export function orderConfirmationEmail(data: {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}): string {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td><td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;">$${item.price.toFixed(2)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h1 style="color:#143D2D;">Thank you for your order!</h1>
      <p>Hi ${data.customerName},</p>
      <p>Your order <strong>${data.orderNumber}</strong> has been confirmed.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead><tr style="background:#143D2D;color:white;"><th style="padding:8px;text-align:left;">Product</th><th style="padding:8px;">Qty</th><th style="padding:8px;">Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="font-size:18px;font-weight:bold;">Total: $${data.total.toFixed(2)}</p>
      <p>We'll notify you when your order ships.</p>
      <p>— ${BRAND.name}</p>
    </div>
  `;
}

export function bookingConfirmationEmail(data: {
  name: string;
  service: string;
  date: string;
  time: string;
}): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h1 style="color:#143D2D;">Booking Request Received</h1>
      <p>Hi ${data.name},</p>
      <p>We've received your booking request for <strong>${data.service}</strong>.</p>
      <p>Preferred: ${data.date} at ${data.time}</p>
      <p>Our team will review your request and confirm availability shortly.</p>
      <p>— ${BRAND.name}</p>
    </div>
  `;
}

export function contactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h1 style="color:#143D2D;">New Contact Inquiry</h1>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p style="background:#f5f5f5;padding:16px;border-radius:8px;">${data.message}</p>
    </div>
  `;
}
