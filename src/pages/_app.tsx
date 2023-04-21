import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useState, useEffect } from "react";
import Camera_Preview from "./components/camera_preview";

export const SnapshotsContext = createContext({});

export default function App({ Component, pageProps }: AppProps) {
  const [snapshots, setSnapshots] = useState(() => {
    let count;
    if (typeof localStorage !== "undefined") {
      count = localStorage.getItem("snapshotsCount");
      count = count ? parseInt(count, 10) : 0;
    }
    return count;
  });

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("snapshotsCount", snapshots.toString());
      console.log("Snapshots count: " + snapshots);
    }
  }, [snapshots]);

  return (
    <SnapshotsContext.Provider value={{ snapshots, setSnapshots }}>
      <div className="home">
        <Camera_Preview />
      </div>
    </SnapshotsContext.Provider>
  );
}
