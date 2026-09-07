import { publicContact, siteUrl } from "@/lib/config";

const contact = publicContact();

export const site = {
  name: "THE FLAGSHIP",
  shortName: "Flagship",
  fullBrand: "The Flagship — AI Podcast & Studio",
  tagline: "Signal, not noise.",
  philosophy: "We make complex things clear.",
  description:
    "The Flagship is an AI podcast and studio for writing, design, digital, strategy and transformation. We make complex things clear.",
  url: siteUrl(),
  email: contact.email,
  phone: contact.phone,
  location: "Colombo, Sri Lanka · Working worldwide",
  socials: [
    { label: "Spotify", href: "#" },
    { label: "Apple Podcasts", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "X", href: "#" },
  ],
  founded: 2025,
};
