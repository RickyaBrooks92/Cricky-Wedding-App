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
      const ALBUM_ID = "dQzvc4G";
      const formData = new FormData();

      // Create a canvas element to draw the snapshot
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas
        .getContext("2d")
        ?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a data URL and append it to the form data
      const dataURL = canvas.toDataURL();
      formData.append("image", dataURL.split(",")[1]);

      // Append the album ID to the form data
      formData.append("album", ALBUM_ID);

      try {
        const response = await fetch("https://api.imgur.com/3/upload", {
          method: "POST",
          headers: {
            Authorization: "Client-ID 769b766a1f7e35f",
          },
          body: formData,
        });

        const responseData = await response.json();
        setImgurLink(responseData.data.link);
        setSnapshot(dataURL);
        console.log(snapshot);
        console.log(imgurLink);
      } catch (error) {
        console.error("Failed to upload image to Imgur", error);
      }
    }
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
    </div>
  );
};

export default CameraPreview;
