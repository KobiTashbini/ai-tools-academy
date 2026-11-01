import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // node-postgres is loaded from node_modules at runtime instead of being bundled into server code.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
