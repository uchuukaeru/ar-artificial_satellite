import { CSV } from "https://js.sabae.cc/CSV.js";

const data = JSON.parse(await Deno.readTextFile("hypocenters.json"));
//console.log(data[0]);
//console.log(data);
const fix = (d) => parseFloat(d).toFixed(0);
const pos = data.map(i => i.position).map(i => ({ lat: i[1], lng: i[0], alt: fix(i[2])}));
await Deno.writeTextFile("hypocenters.csv", CSV.stringify(pos));
