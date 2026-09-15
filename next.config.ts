import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ffmpeg-static resolves its binary path via __dirname at require time;
  // bundling it rewrites that path, so it must stay a native Node require.
  serverExternalPackages: ["ffmpeg-static"],
  allowedDevOrigins: ["hortencia-levitative-sordidly.ngrok-free.dev"],
  // Produces .next/standalone, a self-contained server used by the Docker image.
  output: "standalone",
};

export default nextConfig;
