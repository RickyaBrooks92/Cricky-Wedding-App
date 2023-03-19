import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Camera from "./camera";
import Camera_Preview from "./camera_preview";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Camera />
      <Camera_Preview />
    </>
  );
}
