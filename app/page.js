"use client";

import Hero from "@/components/Hero";
import ParallaxSection from "@/components/ParallaxSection";
import TeamStrip from "@/components/TeamStrip";
import StatsStrip from "@/components/StatsStrip";
import NewsGrid from "@/components/NewsGrid";
import Galleria from "@/components/Galleria.css";
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
