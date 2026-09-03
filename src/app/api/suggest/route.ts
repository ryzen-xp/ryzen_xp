import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const getResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY || "re_dummy");
};

const suggestSchema = z.object({
  noteTitle: z.string().min(1, "Note title is required"),
  name: z.string().optional(),
  email: z.union([z.string().email("Invalid email address"), z.string().length(0)]).optional(),
  suggestion: z.string().min(5, "Suggestion must be at least 5 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = suggestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data" },
        { status: 400 }
      );
    }

    const { noteTitle, name, email, suggestion } = result.data;
    const senderName = name && name.trim().length > 0 ? name : "Anonymous Visitor";
    const replyToEmail = email && email.trim().length > 0 ? email : undefined;
    const resend = getResendClient();

    const { data, error } = await resend.emails.send({
      from: "Portfolio Suggestion <onboarding@resend.dev>",
      to: ["ryzen4540@gmail.com"],
      replyTo: replyToEmail,
      subject: `[Portfolio Suggestion] Note: "${noteTitle}"`,
      html: `
        <h2>New Suggestion from ${senderName}</h2>
        <p><strong>Note:</strong> ${noteTitle}</p>
        ${replyToEmail ? `<p><strong>Email:</strong> ${replyToEmail}</p>` : ''}
        <hr />
        <h3>Suggestion:</h3>
        <p>${suggestion.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email via Resend" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Suggestion sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Suggestion form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
