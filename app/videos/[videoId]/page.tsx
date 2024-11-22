import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Video } from "../../../types";
import Disqus from "../../components/Disqus"; // パスが正しいか確認

// 動的ページ用のServer Component
export default async function VideoPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  // 非同期に解決されるparamsを取得
  const { videoId } = await params;

  // Firebase から動画データを取得
  const docRef = doc(db, "videos", videoId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div>Video not found</div>;
  }

  const video = docSnap.data() as Video;

  // YouTube埋め込みURL
  const embedUrl = `https://www.youtube.com/embed/${video.videoId}`;
  const baseURL = "https://sozanliberalarts-libet-20th.vercel.app"; // デプロイ後に変更
  const videoURL = `${baseURL}/videos/${videoId}`;

  return (
    <div>
      <h1>{video.title}</h1>
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        title={video.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <p>Speaker: {video.speaker}</p>
      <p>Date: {video.date}</p>

      {/* Disqus コメントセクション */}
      <Disqus
        shortname="my-video-app"
        identifier={videoId}
        title={video.title}
        url={videoURL}
      />
    </div>
  );
}
