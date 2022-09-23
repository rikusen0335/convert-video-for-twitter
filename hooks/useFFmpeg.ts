import { StatHelpText } from "@chakra-ui/react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useState } from "react";
import type { FFmpegProgression } from "../types";

export default function useFFmpeg() {
  const [progress, setProgress] = useState<FFmpegProgression | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null)

  const transcode = async (file: File) => {
    const { name } = file;

    const ffmpeg = createFFmpeg({
      corePath: 'http://localhost:3000/ffmpeg-core.js',
      log: true,
      progress: (e: FFmpegProgression) => {
        console.log(e)
        setProgress(state => ({...state, ...e}))
      },
    });

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
