import { useState, useRef } from "react";

const CameraComponent = () => {
  const [picture, setPicture] = useState(null);
  const videoRef = useRef(null);

  const handlePictureClick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL();
    setPicture(dataURL);

    stream.getTracks().forEach((track) => track.stop());
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
