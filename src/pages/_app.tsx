import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Camera from "./camera";
export default function App({ Component, pageProps }: AppProps) {
  return <Camera />;
}
