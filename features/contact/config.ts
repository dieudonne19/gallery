// Variables NEXT_PUBLIC_* : lues à la compilation (voir .env.example).
const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

// wa.me veut le numéro international sans "+" ni espaces, et sans le 0 national après l'indicatif (261 0xx… -> 261 xx…).
export const WHATSAPP_NUMBER = digits.replace(/^2610/, "261");
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";
