import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Camera from "./camera_capture";
import Camera_Preview from "./camera_preview";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div></div>
      <div>
        <Camera_Preview />
      </div>
    </>
  );
}
