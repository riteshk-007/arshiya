import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** Journal images come from our public R2 address; only that host may be resized by the image optimiser. */
function journalImagePattern() {
  try {
    const url = new URL(process.env.R2_PUBLIC_URL ?? "");
    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: `${url.pathname.replace(/\/$/, "")}/**`,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: journalImagePattern(),
    formats: ["image/avif", "image/webp"],
    // Every stored image has a unique name and never changes, so resized copies can be kept for a year.
    minimumCacheTTL: 31_536_000,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
