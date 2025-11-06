"use client";

import Hero from "@/components/Hero";
import ParallaxSection from "@/components/ParallaxSection";
import TeamStrip from "@/components/TeamStrip";
import StatsStrip from "@/components/StatsStrip";
import NewsGrid from "@/components/NewsGrid";

// ✅ Nessun useRouter(), nessun router.push(), nessun redirect
export default function HomePage() {
  return (
    <>
      <Hero />
      <ParallaxSection />
      <TeamStrip />
      <StatsStrip />
      <NewsGrid />
    </>
  );
}
