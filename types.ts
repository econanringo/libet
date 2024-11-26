export interface Video {
    id?: string; // Firestore のドキュメント ID
    title: string;
    videoId: string;
    speaker: string;
    date: string; // yyyy-mm-dd フォーマットを想定
    recaptchaToken: string;
  }
  
  