'use client';
import { useState, useEffect } from "react";
import { saveVideo } from "../../lib/firestore";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebaseConfig";
import { load } from "recaptcha-v3"; // recaptcha-v3をインポート

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // タイマーをセット：2分後にタイムアウト
    const timer = setTimeout(() => {
      setSessionExpired(true); // セッション期限切れ
    }, 2 * 60 * 1000); // 2分

    return () => clearTimeout(timer); // コンポーネントがアンマウントされたときにタイマーをクリア
  }, []);

  // reCAPTCHA トークンを取得する関数
  const handleRecaptchaVerify = async () => {
    try {
      const recaptcha = await load(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!); // サイトキーを環境変数から取得
      const token = await recaptcha.execute("upload_video"); // 'upload_video' はアクション名
      setRecaptchaToken(token); // トークンをステートに保存
    } catch (error) {
      console.error("reCAPTCHA verification failed", error);
      setError("reCAPTCHA verification failed.");
    }
  };

  // Submit ボタンの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // タイムアウト後はフォーム送信不可
    if (sessionExpired) {
      setError("セッションの期限が切れました。ページをリロードしてください。");
      return;
    }

    // トークンがない場合はエラー
    if (!recaptchaToken) {
      setError("Please verify that you are human.");
      return;
    }

    // バリデーション
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      setError("Invalid YouTube Video ID.");
      return;
    }

    if (!date) {
      setError("Date is required.");
      return;
    }

    try {
      setLoading(true);

      // サーバーサイドで reCAPTCHA トークンを検証
      const response = await fetch("/api/verifyRecaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recaptchaToken }),
      });

      const result = await response.json();

      // reCAPTCHA 検証に失敗した場合
      if (response.status !== 200 || result.success !== true) {
        setError(result.error || "Failed to verify reCAPTCHA.");
        setLoading(false);
        return;
      }

      // 動画情報を保存
      const video = { title, videoId, speaker, date, recaptchaToken };
      await saveVideo(video);

      setTitle("");
      setVideoId("");
      setSpeaker("");
      setDate("");
      setError(null); // エラーをリセット
      alert("Video saved successfully!");
      if (analytics) {
        logEvent(analytics, "button_click", { button_name: "upload_button" });
      }
    } catch (error) {
      setError("Failed to save video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ページがロードされた時にreCAPTCHAを自動的に検証開始
    handleRecaptchaVerify();
  }, []);

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>Upload Video</h1>

      {sessionExpired && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          セッションの期限が切れました。ページをリロードしてください。
        </div>
      )}

      {error && !sessionExpired && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="YouTube Video ID"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Speaker"
        value={speaker}
        onChange={(e) => setSpeaker(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit" disabled={loading || sessionExpired || !recaptchaToken}>
        {loading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
};

export default UploadPage;
