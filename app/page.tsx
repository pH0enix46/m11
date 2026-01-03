import Hero from "@/components/landing/Hero";
import Description from "@/components/landing/Description";
import EndSale from "@/components/landing/EndSale";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <EndSale />
      <Description />
    </main>
  );
}
