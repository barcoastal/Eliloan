import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@example.com";
export const APP_URL = process.env.APP_URL || "http://localhost:3000";
