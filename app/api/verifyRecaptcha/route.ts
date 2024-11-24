// app/api/verifyRecaptcha/route.ts

import { NextResponse } from "next/server";

const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    body: new URLSearchParams({
      secret: secretKey!,
      response: token,
    }),
  });

  const data = await res.json();
  return data.success;
};

export async function POST(req: Request) {
  const { recaptchaToken } = await req.json(); // リクエストボディを取得

  const isValid = await verifyRecaptcha(recaptchaToken);

  if (!isValid) {
    return NextResponse.json(
      { error: "reCAPTCHA verification failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
