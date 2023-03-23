import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Camera_Preview from "./camera_preview";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div>
        <Camera_Preview />
      </div>
    </>
  );
}
