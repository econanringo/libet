// pages/api/verifyRecaptcha.ts

import type { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { recaptchaToken } = req.body;

    const isValid = await verifyRecaptcha(recaptchaToken);

    if (!isValid) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
