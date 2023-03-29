import React, { useRef, useEffect, useState } from "react";
import Button from "@mui/material/Button";

import { styled } from "@mui/material/styles";

const VideoContainer = styled("div")({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const StyledVideo = styled("video")({
  width: "100%",
  height: "auto",
});

const ButtonContainer = styled("div")({
  position: "absolute",
  bottom: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const StyledButton = styled(Button)({
  margin: "0 10px",
  color: "#fff",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
});

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

        // Flash the snapshot
        const snapshot = document.createElement("div");
        snapshot.classList.add("snapshot");
        snapshot.style.width = `${snapshotCanvas.width}px`;
        snapshot.style.height = `${snapshotCanvas.height}px`;
        document.body.appendChild(snapshot);

        setTimeout(() => {
          snapshot.remove();
        }, 500);

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
    <VideoContainer>
      <StyledVideo
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={videoStyle}
      />
      <ButtonContainer>
        <StyledButton variant="contained" onClick={handleSnapshotClick}>
          Take Snapshot
        </StyledButton>
        <StyledButton variant="contained" onClick={switchCamera}>
          Switch Camera
        </StyledButton>
      </ButtonContainer>
    </VideoContainer>
  );
};

export default CameraPreview;
