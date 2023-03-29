import React, { useRef, useEffect, useState } from "react";

import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";

const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

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

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
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
        } catch (error) {
          console.error("Failed to upload image to Imgur", error);
        }

        // Add flash effect
        const flash = document.createElement("div");
        flash.classList.add("flash");
        document.body.appendChild(flash);
        setTimeout(() => {
          flash.remove();
        }, 200);
      }
    }
  };

  const videoStyle = {
    transform: facingMode === "user" ? "scaleX(-1)" : "none",
  };

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="video"
        style={videoStyle}
      ></video>
      <div className="button-container">
        <button className="button" onClick={handleSnapshotClick}>
          <CircleRoundedIcon className="icon" />
        </button>
        <button className="button" onClick={switchCamera}>
          <FlipCameraIosIcon className="icon" />
        </button>
      </div>
    </div>
  );
};

export default CameraPreview;
