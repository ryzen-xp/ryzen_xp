import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();
    const expectedPasscode = process.env.HANDBOOK_PASSCODE || "sandeep-research";

    if (passcode === expectedPasscode) {
      const cookieStore = await cookies();
      cookieStore.set("handbook_unlocked", "true", {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
        httpOnly: false,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Incorrect passcode" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
