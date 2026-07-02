import { useEffect, useRef, useState } from "react";

type CameraStatus = "loading" | "active" | "error";

export default function CameraScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>("loading");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let disposed = false;

    const stopStream = () => {
      stream?.getTracks().forEach((track) => track.stop());
      stream = null;
    };

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        return;
      }

      try {
        const nextStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (disposed) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = nextStream;
        const video = videoRef.current;
        if (!video) {
          stopStream();
          return;
        }

        video.srcObject = nextStream;
        await video.play();
        if (!disposed) setStatus("active");
      } catch {
        stopStream();
        if (!disposed) setStatus("error");
      }
    };

    void startCamera();

    return () => {
      disposed = true;
      stopStream();
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, []);

  return (
    <div className={`scanner-frame scanner-frame--${status}`}>
      <video
        ref={videoRef}
        className="scanner-video"
        autoPlay
        muted
        playsInline
        aria-label="实时摄像头画面"
      />
      <span className="scanner-tint" aria-hidden="true" />
      <span className="scan-corner scan-corner--tl" aria-hidden="true" />
      <span className="scan-corner scan-corner--tr" aria-hidden="true" />
      <span className="scan-corner scan-corner--bl" aria-hidden="true" />
      <span className="scan-corner scan-corner--br" aria-hidden="true" />
      <span className="scanner-line" aria-hidden="true" />

      {status === "error" ? (
        <span className="scanner-status" role="status" aria-live="polite">
          <strong>摄像头未授权</strong>
          <small>请允许浏览器访问摄像头</small>
        </span>
      ) : null}
    </div>
  );
}
