import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useState } from "react";

export default function useFFmpeg() {
  const [progress, setProgress] = useState<{ ratio: number } | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null)

  const ffmpeg = createFFmpeg({
    corePath: 'http://localhost:3000/ffmpeg-core.js',
    log: true,
    progress: (e) => setProgress(e),
  });

  const transcode = async (file: File) => {
    const { name } = file;
    await ffmpeg.load();
    ffmpeg.FS("writeFile", name, await fetchFile(file));
    await ffmpeg.run("-i", name, "-filter:v", "fps=fps=40", "output.mp4");
    const data = ffmpeg.FS("readFile", "output.mp4");
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    setVideoURL(url)
    setProgress(null)
  };

  const handleFileChange = (e: any) => {
    transcode(e.target.files[0]);
  };

  return {
    progress,
    videoURL,
    handleFileChange,
  } as const;
}
