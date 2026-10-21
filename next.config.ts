import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Smaller deploy bundle for Node hosts (Hostinger, VPS). */
  output: "standalone",
  images: {
    qualities: [75, 90, 95],
  },
  async redirects() {
    return [
      // Profiles for products that do not exist (Oct 2026 catalog audit): permanent, so Google
      // moves their signals to the real machine.
      { source: "/:locale(en|fr)/lasers/sculpfun-s30-ultra-20w", destination: "/:locale/lasers/sculpfun-s30-ultra-22w", permanent: true },
      { source: "/:locale(en|fr)/lasers/comgrow-z1-20w", destination: "/:locale/lasers/comgrow-z1-10w", permanent: true },
      { source: "/:locale(en|fr)/lasers/algolaser-alpha-mk2-10w", destination: "/:locale/lasers/algolaser-diy-kit-mk2-10w", permanent: true },
      { source: "/:locale(en|fr)/lasers/foxaliens-reisler-2", destination: "/:locale/lasers/foxaliens-reizer-40w", permanent: true },
      { source: "/:locale(en|fr)/compare/foxaliens-reisler-2-vs-ortur-laser-master-3-20w", destination: "/:locale/lasers/ortur-laser-master-3-20w", permanent: true },
      { source: "/:locale(en|fr)/lasers/atezr-p2", destination: "/:locale/lasers", permanent: true },
      { source: "/:locale(en|fr)/brands/atezr", destination: "/:locale/brands", permanent: true },
      { source: "/:locale(en|fr)/lasers/acmer-p3", destination: "/:locale/lasers/acmer-p3-48w", permanent: true },
      // Industrial sheet cutters (OMTech FC) and duplicate or never-sold profiles (Oct 2026 review).
      { source: "/:locale(en|fr)/lasers/omtech-fc-105sa", destination: "/:locale/brands/omtech", permanent: true },
      { source: "/:locale(en|fr)/lasers/omtech-fc-105sat", destination: "/:locale/brands/omtech", permanent: true },
      { source: "/:locale(en|fr)/lasers/omtech-fc-44-intelli", destination: "/:locale/brands/omtech", permanent: true },
      { source: "/:locale(en|fr)/lasers/omtech-fc-510-intelli", destination: "/:locale/brands/omtech", permanent: true },
      { source: "/:locale(en|fr)/lasers/omtech-fc105-fiber", destination: "/:locale/brands/omtech", permanent: true },
      { source: "/:locale(en|fr)/lasers/atomstack-a24-ultra", destination: "/:locale/lasers/atomstack-a24-pro", permanent: true },
      { source: "/:locale(en|fr)/lasers/gweike-cloud-50w", destination: "/:locale/lasers/gweike-cloud-pro", permanent: true },
      { source: "/:locale(en|fr)/lasers/gweike-cloud-55w", destination: "/:locale/lasers/gweike-cloud-pro", permanent: true },
      {
        source: "/lasers/xtool-s1",
        destination: "/en/lasers/xtool-s1-20w",
        permanent: true,
      },
      {
        source: "/lasers/sculpfun-s30-ultra",
        destination: "/en/lasers/sculpfun-s30-ultra-22w",
        permanent: true,
      },
      {
        source: "/lasers/ortur-laser-master-3",
        destination: "/en/lasers/ortur-laser-master-3-20w",
        permanent: true,
      },
      { source: "/lasers/longer-ray5", destination: "/en/lasers/longer-ray5-20w", permanent: true },
      { source: "/lasers/longer-laser-b1", destination: "/en/lasers/longer-laser-b1-40w", permanent: true },
      { source: "/lasers/algolaser-alpha-mk2", destination: "/en/lasers/algolaser-alpha-mk2-40w", permanent: true },
      { source: "/lasers/sculpfun-s9", destination: "/en/lasers/sculpfun-s9-10w", permanent: true },
      { source: "/lasers/sculpfun-icube-pro", destination: "/en/lasers/sculpfun-icube-pro-5w", permanent: true },
      { source: "/lasers/ortur-laser-master-h10", destination: "/en/lasers/ortur-laser-master-h10-20w", permanent: true },
      { source: "/lasers/twotrees-tts-55", destination: "/en/lasers/twotrees-tts-55-20w", permanent: true },
      { source: "/lasers/atomstack-a40-pro", destination: "/en/lasers/atomstack-a40-pro-40w", permanent: true },
      { source: "/lasers/xtool-d1-pro", destination: "/en/lasers/xtool-d1-pro-20w", permanent: true },
      { source: "/lasers/atomstack-a5-pro", destination: "/en/lasers/atomstack-a5-pro-10w", permanent: true },
      { source: "/lasers/comgrow-z1", destination: "/en/lasers/comgrow-z1-10w", permanent: true },
      { source: "/lasers/ortur-h20", destination: "/en/lasers/ortur-h20-20w", permanent: true },
      { source: "/lasers/acmer-p1", destination: "/en/lasers/acmer-p1-10w", permanent: true },
      { source: "/lasers/acmer-p2", destination: "/en/lasers/acmer-p2-33w", permanent: true },
      {
        source: "/lasers/sculpfun-s30-pro-max",
        destination: "/en/lasers/sculpfun-s30-pro-max-20w",
        permanent: true,
      },
      {
        source: "/lasers/sculpfun-s30-pro",
        destination: "/en/lasers/sculpfun-s30-pro-10w",
        permanent: true,
      },
      {
        source: "/lasers/ortur-laser-master-2-s2",
        destination: "/en/lasers/ortur-lm2-s2-10w",
        permanent: true,
      },
      {
        source: "/lasers/algolaser-diy-kit-mk2",
        destination: "/en/lasers/algolaser-diy-kit-mk2-10w",
        permanent: true,
      },
      { source: "/lasers/creality-falcon2-pro", destination: "/en/lasers/creality-falcon2-pro-40w", permanent: true },
      { source: "/lasers/two-trees-tts-55-pro", destination: "/en/lasers/two-trees-tts-55-pro-20w", permanent: true },
    ];
  },
};

export default nextConfig;
