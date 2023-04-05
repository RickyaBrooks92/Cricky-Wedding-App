import React, { useState, useEffect } from "react";

const Flash_Button = () => {
  const [flash, setFlash] = useState("off");

  useEffect(() => {
    console.log("Flash is " + flash);
  }, [flash]);

  const handleFlashClick = () => {
    if (flash === "off") {
      setFlash("on");
    } else {
      setFlash("off");
    }
  };

  return (
    <div>
      <button onClick={handleFlashClick}>
        {flash === "off" ? "Flash off" : "Flash on"}
      </button>
    </div>
  );
};

export default Flash_Button;
