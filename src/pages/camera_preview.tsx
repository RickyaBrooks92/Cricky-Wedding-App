import React, { useRef, useEffect, useState } from "react";

const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [imgurLink, setImgurLink] = useState<string | null>(null);

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
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas
        .getContext("2d")
        ?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const snapshotCanvas = document.createElement("canvas");
      snapshotCanvas.width = canvas.width;
      snapshotCanvas.height = canvas.height;
      const ctx = snapshotCanvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(canvas, 0, 0);
        const dataURL = snapshotCanvas.toDataURL();

        // Upload image to Imgur
        const formData = new FormData();
        formData.append("image", dataURL.split(",")[1]);

        try {
          const response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
              Authorization: `Client-ID 658bf713084435a`,
            },
            body: formData,
          });

          const responseData = await response.json();
          setImgurLink(responseData.data.link);
        } catch (error) {
          console.error("Failed to upload image to Imgur", error);
        }

        setSnapshot(dataURL);
      }
    }
  };

  const handleCreateAlbumClick = async () => {
    const title = "Cricky Wedding Album";
    const description = "Cricky Wedding Album 2023 from App";
    const createImgurAlbum = async (title, description) => {
      const response = await fetch("https://api.imgur.com/3/album", {
        method: "POST",
        headers: {
          Authorization: "Client-ID 658bf713084435a",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await response.json();

      return data.data.id;
    };
  };

  const videoStyle = {
    transform: facingMode === "user" ? "scaleX(-1)" : "none",
  };

  return (
    <div>
      {imgurLink ? (
        <img src={imgurLink} alt="Uploaded to Imgur" />
      ) : snapshot ? (
        <img src={snapshot} alt="Snapshot" />
      ) : (
        <video ref={videoRef} autoPlay playsInline muted style={videoStyle} />
      )}
      {!imgurLink && (
        <button onClick={handleSnapshotClick}>Take Snapshot</button>
      )}
      <button onClick={handleFacingModeChange}>Switch Camera</button>
      <button onClick={handleCreateAlbumClick}>Create Album</button>
    </div>
  );
};

export default CameraPreview;
