import dns from "node:dns/promises";
import net from "node:net";

function blockedIp(address: string) {
  const normalized = address.toLowerCase().replace(/^::ffff:/, "");
  if (net.isIPv4(normalized)) {
    const [a, b] = normalized.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a >= 224;
  }
  if (!net.isIPv6(normalized)) return true;
  return normalized === "::" || normalized === "::1" || normalized.startsWith("fe80:") || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("ff");
}

export async function assertPublicUrl(input: string) {
  const url = new URL(input);
  if (!(["http:", "https:"].includes(url.protocol)) || url.username || url.password) throw new Error("unsafe URL");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) throw new Error("private host");
  const addresses = net.isIP(host) ? [host] : (await dns.lookup(host, { all: true })).map(({ address }) => address);
  if (!addresses.length || addresses.some(blockedIp)) throw new Error("private address");
  return url;
}
