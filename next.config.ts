import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ffmpeg-static resolves its binary path via __dirname at require time;
  // bundling it rewrites that path, so it must stay a native Node require.
  serverExternalPackages: ["ffmpeg-static"],
};

export default nextConfig;
