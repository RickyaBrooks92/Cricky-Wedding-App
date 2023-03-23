import { useState, useRef } from "react";

const CameraComponent = () => {
  const [picture, setPicture] = useState(null);
  const videoRef = useRef(null);

  const handlePictureClick = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    setPicture(canvas.toDataURL("image/jpeg"));
  };

  return (
    <div>
      {picture ? (
        <img src={picture} alt="User's taken picture" />
      ) : (
        <>
          <video ref={videoRef} autoPlay></video>
          <button onClick={handlePictureClick}>Take a Picture</button>
        </>
      )}
    </div>
  );
};

export default CameraComponent;
