import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { getAssessment, getCalculator } from "@/lib/data/tools";
import AssessTool from "@/components/AssessTool";
import CalculatorTool from "@/components/CalculatorTool";
import BriefBuilder from "@/components/BriefBuilder";
import { PageHero, Section } from "@/components/ui";

const TOOL_IDS = [
  "transformation-index", "ai-readiness",
  "roi-calculator", "productivity-calculator", "project-estimator", "content-calculator",
  "brief-builder",
];

export function generateStaticParams() {
  return TOOL_IDS.flatMap((tool) => ["en", "de", "ja", "fr", "nl", "ar", "es"].map((locale) => ({ locale, tool })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  const assessment = getAssessment(tool);
  const calculator = getCalculator(tool);
  const name = assessment?.name ?? calculator?.name ?? (tool === "brief-builder" ? "Project Brief Generator" : "Tool");
  return { title: name };
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; tool: string }> }) {
  const { locale: raw, tool } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDict(locale);

  const assessment = getAssessment(tool);
  if (assessment) {
    return (
      <>
        <PageHero kicker={assessment.kicker} title={assessment.name} sub={assessment.intro} />
        <Section className="py-16">
          <AssessTool locale={locale} dict={d} config={assessment} />
        </Section>
      </>
    );
  }

  const calculator = getCalculator(tool);
  if (calculator) {
    return (
      <>
        <PageHero kicker={calculator.kicker} title={calculator.name} sub={calculator.intro} />
        <Section className="py-16">
          <CalculatorTool locale={locale} dict={d} config={calculator} />
        </Section>
      </>
    );
  }

  if (tool === "brief-builder") {
    return (
      <>
        <PageHero kicker="Generator · 10 steps" title="Project Brief Generator" sub="A sentence in, a structured brief out: objective, problem, materials, success, services, timeline, budget — ready to send." />
        <Section className="py-16">
          <BriefBuilder
            locale={locale}
            dict={d}
            services={[
              { slug: "writing", title: "Writing & Content", short: "Writing" },
              { slug: "design", title: "Design & Brand", short: "Design" },
              { slug: "digital", title: "Digital & Web", short: "Digital" },
              { slug: "strategy", title: "Strategy & Transformation", short: "Strategy" },
              { slug: "ai", title: "AI & Automation", short: "AI" },
              { slug: "podcast", title: "Podcast & Media", short: "Media" },
              { slug: "training", title: "Training & Workshops", short: "Training" },
            ]}
          />
        </Section>
      </>
    );
  }

  notFound();
}
