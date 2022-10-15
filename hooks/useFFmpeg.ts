import { StatHelpText } from "@chakra-ui/react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useState } from "react";
import { getLocationOrigin } from "../libs/utils";

import type { FFmpegProgression } from "../types";

export default function useFFmpeg() {
  const [progress, setProgress] = useState<FFmpegProgression | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null)

  const transcode = async (file: File) => {
    if (!file) return;

    const { name } = file;

    const ffmpeg = createFFmpeg({
      corePath: `${getLocationOrigin()}/ffmpeg-core.js`,
      log: true,
      progress: (e: FFmpegProgression) => setProgress(state => ({...state, ...e})),
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
