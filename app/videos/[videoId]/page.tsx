import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Video } from "../../../types";
import Disqus from "../../components/Disqus";

interface Props {
  params: { videoId: string };
}

const VideoPage = async ({ params }: Props) => {
  const videoId = params.videoId;
  const docRef = doc(db, "videos", videoId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div>Video not found</div>;
  }

  const video = docSnap.data() as Video;

  // 自分のアプリのベース URL を設定
  const baseURL = "https://my-video-app.vercel.app"; // デプロイ後に変更
  const videoURL = `${baseURL}/videos/${videoId}`;

  return (
    <div>
      <h1>{video.title}</h1>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${video.videoId}`}
        title={video.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <p>Speaker: {video.speaker}</p>
      <p>Date: {video.date}</p>

      {/* Disqus コメントセクション */}
      <Disqus
        shortname="my-video-app" // Disqus の shortname を入力
        identifier={videoId}
        title={video.title}
        url={videoURL}
      />
    </div>
  );
};

export default VideoPage;
