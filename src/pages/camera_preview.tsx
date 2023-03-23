import React, { useRef, useEffect, useState } from "react";

const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [snapshot, setSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (snapshot) {
      const formData = new FormData();
      formData.append("image", snapshot);
      fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: "Client-ID 658bf713084435a",
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to upload image");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Image uploaded successfully", data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [snapshot]);

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

  const handleSnapshotClick = () => {
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
        setSnapshot(dataURL);
      }
    }
  };

  const videoStyle = {
    transform: facingMode === "user" ? "scaleX(-1)" : "none",
  };

  return (
    <div>
      {snapshot ? (
        <div>
          <img src={snapshot} alt="Snapshot" />
          <div>
            <button onClick={handleSnapshotClick}>Take Another Snapshot</button>
          </div>
        </div>
      ) : (
        <div>
          <video ref={videoRef} autoPlay playsInline muted style={videoStyle} />
          <div>
            <button onClick={handleSnapshotClick}>Take Snapshot</button>
          </div>
        </div>
      )}
      <button onClick={handleFacingModeChange}>Switch Camera</button>
    </div>
  );
};

export default CameraPreview;
