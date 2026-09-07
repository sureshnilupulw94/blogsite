export function canExposeDevLink(input: { nodeEnv?: string; flag?: string }) {
  return input.nodeEnv !== "production" && input.flag !== "off";
}
