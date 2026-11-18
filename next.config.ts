import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    // Pins the workspace root to this project. Without it, Turbopack walks
    // up looking for the nearest lockfile and can land on an unrelated
    // package-lock.json higher up in the user's home directory.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
