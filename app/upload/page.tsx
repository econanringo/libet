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
    <><form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Upload Video</h1>

          {sessionExpired && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              セッションの期限が切れました。ページをリロードしてください。
            </div>
          )}

          {error && !sessionExpired && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}
        </div>
        <div>
          <div className="relative z-0 w-full mb-5 group">
            <input type="text" placeholder="" value={title} onChange={(e) => setTitle(e.target.value)} required name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-red-600 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Title</label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input type="text" placeholder="" value={videoId} onChange={(e) => setVideoId(e.target.value)} required name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
            <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-red-600 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">YouTube Video ID</label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input type="text" placeholder="" value={speaker} onChange={(e) => setSpeaker(e.target.value)} required name="floating_password2" id="floating_password2" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
            <label htmlFor="floating_password2" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-red-600 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Speaker</label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
            <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-red-600 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Date</label>
          </div>
          <button type="submit" className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Submit</button>
        </div>
      </div>
    </form></>
  );
};

export default UploadPage;
