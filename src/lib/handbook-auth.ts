import { headers, cookies } from "next/headers";

export async function isHandbookUnlocked(searchParamsSecret?: string): Promise<{
  unlocked: boolean;
  reason?: "localhost" | "ip" | "secret" | "cookie";
}> {
  // 1. Development mode (localhost) is always unlocked
  if (process.env.NODE_ENV === "development") {
    return { unlocked: true, reason: "localhost" };
  }

  const expectedPasscode = process.env.HANDBOOK_PASSCODE || "sandeep-research";
  const allowedIp = process.env.ALLOWED_IP;

  // 2. Check secret from query parameter ?secret=...
  if (searchParamsSecret && searchParamsSecret === expectedPasscode) {
    // Set 1-year authenticated cookie
    const cookieStore = await cookies();
    cookieStore.set("handbook_unlocked", "true", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      httpOnly: false,
    });
    return { unlocked: true, reason: "secret" };
  }

  // 3. Check existing cookie
  const cookieStore = await cookies();
  const hasCookie = cookieStore.get("handbook_unlocked")?.value === "true";
  if (hasCookie) {
    return { unlocked: true, reason: "cookie" };
  }

  // 4. Check client IP
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp;

  if (allowedIp && clientIp && (clientIp === allowedIp || allowedIp.split(",").map(i => i.trim()).includes(clientIp))) {
    return { unlocked: true, reason: "ip" };
  }

  return { unlocked: false };
}
