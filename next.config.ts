import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      // 버킷의 파일 크기 제한(5MB)에 multipart 오버헤드를 더한 값입니다.
      bodySizeLimit: "6mb"
    }
  }
};

export default nextConfig;
