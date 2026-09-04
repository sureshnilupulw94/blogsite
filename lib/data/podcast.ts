export type Episode = {
  slug: string;
  number: number;
  title: string;
  guest: string;
  role: string;
  date: string;
  duration: string;
  teaser: string;
  topics: string[];
  showNotes: string[];
  quote: string;
};

export const episodes: Episode[] = [
  {
    slug: "001-the-knowledge-architects",
    number: 1,
    title: "The Knowledge Architects",
    guest: "Dr. Amara Silva",
    role: "Head of Transformation, regional bank",
    date: "2026-08-28",
    duration: "48 min",
    teaser: "Why the bank that documented everything moved faster than the bank that didn't — and what 'knowledge architecture' actually means in practice.",
    topics: ["Knowledge management", "Transformation", "Documentation"],
    showNotes: ["How a 4,000-person bank mapped its tribal knowledge", "The 90-day documentation sprint that changed the culture", "Why AI makes knowledge architecture urgent"],
    quote: "We didn't have a documentation problem. We had a knowledge architecture problem.",
  },
  {
    slug: "002-fewer-disconnected-workflows",
    number: 2,
    title: "Fewer Disconnected Workflows",
    guest: "Rajiv Perera",
    role: "Founder, logistics startup",
    date: "2026-08-14",
    duration: "41 min",
    teaser: "A startup with 31 SaaS tools and no processes. What happened when they deleted two-thirds of both.",
    topics: ["Automation", "Process", "Startups"],
    showNotes: ["The tool audit that saved $2,300/month", "Automation before AI: the boring truth", "How to design a workflow you can actually keep"],
    quote: "Most companies don't need more AI tools. They need fewer disconnected workflows.",
  },
  {
    slug: "003-the-presentation-that-raised",
    number: 3,
    title: "The Presentation That Raised $4M",
    guest: "Nadia Fernando",
    role: "GP, early-stage fund",
    date: "2026-07-31",
    duration: "36 min",
    teaser: "An investor reads 40 decks a week. Here's what makes her stop — told from the other side of the table.",
    topics: ["Fundraising", "Presentation", "Storytelling"],
    showNotes: ["The 90-second test every deck must pass", "Data slides that build trust", "Story before design, always"],
    quote: "A beautiful presentation cannot rescue a weak idea — but a bad one can absolutely kill a good one.",
  },
  {
    slug: "004-ai-for-the-rest-of-us",
    number: 4,
    title: "AI for the Rest of Us",
    guest: "Kasun Wijesinghe",
    role: "COO, manufacturing group",
    date: "2026-07-17",
    duration: "52 min",
    teaser: "No data scientists, no budget for a platform — and still a 30% reduction in manual work. A practical AI story from a traditional business.",
    topics: ["AI", "Manufacturing", "Operations"],
    showNotes: ["Where the first automation hours came from", "Building the Business Brain on a budget", "Getting the shop floor to trust the tools"],
    quote: "Start with the workflow, not the tool.",
  },
  {
    slug: "005-the-brand-voice-principle",
    number: 5,
    title: "One Voice, Every Document",
    guest: "Dilini Rajapaksa",
    role: "Brand Director, hospitality group",
    date: "2026-07-03",
    duration: "44 min",
    teaser: "Twelve properties, nine agencies, one inconsistent brand. How they rebuilt a voice system that survives contact with reality.",
    topics: ["Brand", "Writing", "Systems"],
    showNotes: ["Voice guidelines people actually use", "The Brand Brain approach", "Training 200 staff to sound like one brand"],
    quote: "Consistency isn't a style guide. It's a system.",
  },
  {
    slug: "006-the-transformation-map",
    number: 6,
    title: "From Idea to Growth",
    guest: "The Flagship Studio team",
    role: "Roundtable",
    date: "2026-06-19",
    duration: "58 min",
    teaser: "The eight stages every business passes through — and why most get stuck between confusion and clarity.",
    topics: ["Transformation", "Strategy", "Frameworks"],
    showNotes: ["Introducing the Transformation Map", "The CREATE framework explained", "Where services fit in the journey"],
    quote: "Clarity is a deliverable. You can design it.",
  },
];

export function getEpisode(slug: string) {
  return episodes.find((e) => e.slug === slug);
}

/* ---------- ideas ---------- */

export const ideas = [
  "Businesses don't have a documentation problem. They have a knowledge architecture problem.",
  "Most companies don't need more AI tools. They need fewer disconnected workflows.",
  "A beautiful presentation cannot rescue a weak idea — but a bad presentation can absolutely kill a good one.",
  "Clarity is a deliverable. You can design it, price it, and ship it.",
  "Your website is not a brochure. It's your best salesperson — is it trained?",
  "Every document is an interface. Most are badly designed.",
  "Consistency isn't a style guide. It's a system.",
  "Automation before AI: fix the process you're about to accelerate.",
  "The cheapest employee handbook is the one nobody needs to read twice.",
  "Content is a compounding asset. Ads are rent.",
];
