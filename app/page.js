"use client";

import Hero from "@/components/Hero";
import ParallaxSection from "@/components/ParallaxSection";
import TeamStrip from "@/components/TeamStrip";
import StatsStrip from "@/components/StatsStrip";
import NewsGrid from "@/components/NewsGrid";

export default function Home() {
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
