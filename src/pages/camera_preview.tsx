import React, { useRef, useEffect, useState } from "react";

const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const handleFacingModeChange = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  const videoStyle = {
    transform: facingMode === "user" ? "scaleX(-1)" : "none",
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted style={videoStyle} />
      <button onClick={handleFacingModeChange}>Switch Camera</button>
    </div>
  );
};

export default CameraPreview;
