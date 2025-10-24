import Hero from '@/components/Hero';
import StatsStrip from '@/components/StatsStrip';
import ParallaxSection from '@/components/ParallaxSection';
import NewsGrid from '@/components/NewsGrid';
import TeamStrip from '@/components/TeamStrip';
import PartnersMarquee from '@/components/PartnersMarquee';
import WhatsappFAB from '@/components/WhatsappFAB';

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsStrip />
      <ParallaxSection />
      <NewsGrid />
      <TeamStrip />
      <PartnersMarquee />
      <WhatsappFAB phone="+393488008762" />
    </main>
  );
}
