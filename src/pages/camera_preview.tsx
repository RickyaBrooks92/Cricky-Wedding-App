import React, { useRef, useEffect, useState } from "react";

const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [imgurLink, setImgurLink] = useState<string | null>(null);

  const ALBUM_ID = "K0pyWdL";
  const ACCESS_TOKEN = "c3943d7d300d0dc865983e4036a81fae4f948326";

  useEffect(() => {
    if (videoRef.current) {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode } })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
          })
          .catch((error) => {
            console.error("Failed to access camera", error);
          });
      } else {
        console.error("getUserMedia not supported");
      }
    }
  }, [facingMode]);

  const handleFacingModeChange = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  const handleSnapshotClick = async () => {
    if (videoRef.current) {
      // Create canvas and draw current video frame
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas
        .getContext("2d")
        ?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Create snapshot canvas and apply mirroring transformation if front-facing camera
      const snapshotCanvas = document.createElement("canvas");
      snapshotCanvas.width = canvas.width;
      snapshotCanvas.height = canvas.height;
      const ctx = snapshotCanvas.getContext("2d");
      if (ctx) {
        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(canvas, 0, 0);

        // Flash effect
        const originalBackgroundColor = videoRef.current.style.backgroundColor;
        videoRef.current.style.backgroundColor = "red";
        await new Promise((resolve) => setTimeout(resolve, 1000));
        videoRef.current.style.backgroundColor = originalBackgroundColor;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        videoRef.current.style.backgroundColor = "red";
        await new Promise((resolve) => setTimeout(resolve, 1000));
        videoRef.current.style.backgroundColor = originalBackgroundColor;

        const dataURL = snapshotCanvas.toDataURL();

        // Upload image to Imgur
        const formData = new FormData();
        formData.append("image", dataURL.split(",")[1]);
        formData.append("album", ALBUM_ID);

        try {
          const response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: formData,
          });

          const responseData = await response.json();
          console.log(responseData);
          setImgurLink(responseData.data.link);
        } catch (error) {
          console.error("Failed to upload image to Imgur", error);
        }

        setSnapshot(dataURL);
      }
    }
  };

  const videoStyle = {
    transform: facingMode === "user" ? "scaleX(-1)" : "none",
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted style={videoStyle} />
      <button onClick={handleSnapshotClick}>Take Snapshot</button>
      <button onClick={handleFacingModeChange}>Switch Camera</button>
    </div>
  );
};

export default CameraPreview;
