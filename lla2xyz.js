import { deg2rad } from "./deg2rad.js";

export const earthr = 12742 * 1000 / 2;

export const lla2xyz = (lat, lng, alt, r = 1.0) => {
  const d = r + alt / earthr;
  const th = Math.PI / 2 + deg2rad(lng);
  const phi = deg2rad(lat);
  const x = d * Math.sin(th) * Math.cos(phi);
  const y = d * Math.sin(th) * Math.sin(phi);
  const z = d * Math.cos(th);
  return { x, y, z };
};
