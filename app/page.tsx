import Hero from "@/components/landing/Hero";
import Description from "@/components/landing/Description";
import EndSale from "@/components/landing/EndSale";
import Collection from "@/components/landing/Collection";
import PeoplesWord from "@/components/landing/PeoplesWord";
import Contact from "@/components/landing/Contact";
// import ShoeMarquee from "@/components/landing/ShoeMarque";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      {/* <ShoeMarquee /> */}
      <EndSale />
      <Description />
      <Collection />
      <PeoplesWord />
      <Contact />
    </main>
  );
}
