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
  console.log('reCAPTCHA Response:', data); // reCAPTCHAのレスポンスを確認
  return data.success;
};

export async function POST(req: Request) {
  const { recaptchaToken } = await req.json(); // リクエストボディを取得
  console.log('Received recaptchaToken:', recaptchaToken); // 受け取ったトークンを確認

  const isValid = await verifyRecaptcha(recaptchaToken);

  if (!isValid) {
    return NextResponse.json(
      { error: "reCAPTCHA verification failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
