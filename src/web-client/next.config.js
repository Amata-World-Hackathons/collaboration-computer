/** @type {import('next').NextConfig} */
const path = require("path");

const DFX_NETWORK =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === "production" ? "ic" : "local");

function computeCanisterEnv() {
  let localCanisters, prodCanisters;
  try {
    localCanisters = require(path.resolve(
      "..",
      "..",
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.resolve("..", "..", "canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const canisterConfig =
    DFX_NETWORK === "local" ? localCanisters : prodCanisters;

  return Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;

    // NextJS doesn't like anything with a __, doesn't seem to affect the
    // functionality too
    if (canisterName === "__Candid_UI") return prev;

    prev[canisterName.toUpperCase() + "_CANISTER_ID"] =
      canisterDetails[DFX_NETWORK];
    return prev;
  }, {});
}

const nextConfig = {
  env: { ...computeCanisterEnv(), DFX_NETWORK },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
