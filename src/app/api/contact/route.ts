import { NextResponse } from "next/server";
import type { ContactMessage } from "@/types";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot check (should be empty)
    if (body.website) {
      return NextResponse.json(
        { ok: false, message: "Spam detected" },
        { status: 400 }
      );
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 422 }
      );
    }
    if (!validateEmail(email)) {
      return NextResponse.json(
        { ok: false, message: "Invalid email" },
        { status: 422 }
      );
    }

    const payload: ContactMessage = {
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    // TODO: Replace this with real email/send logic (SendGrid, Mailgun, SES, or DB)
    console.log(
      "[Contact] Received message:",
      JSON.stringify(payload, null, 2)
    );

    return NextResponse.json(
      { ok: true, message: "Message received" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Contact] Error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}