import axios from 'axios';

export const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;  // サーバーサイドの秘密キー

  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret: secretKey,
        response: token,
      },
    }
  );

  return response.data.success;  // トークンの検証結果（成功か失敗か）
};
