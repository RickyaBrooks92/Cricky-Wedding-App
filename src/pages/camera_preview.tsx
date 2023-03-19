import React, { useRef, useEffect } from "react";

const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current!.srcObject = stream;
          videoRef.current!.play();
        })
        .catch((error) => {
          console.error("Failed to access camera", error);
        });
    }
  }, []);

  return (
    <div>
      <video ref={videoRef} />
    </div>
  );
};

export default CameraPreview;
