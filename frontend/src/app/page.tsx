import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Hobbies from "@/components/sections/Hobbies";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Hero layout="left-aligned" headingStyle="bold-sans" />
      <Skills displayMode="grouped" />
      <Experience displayMode="timeline" />
      <Hobbies />
      <Footer />
    </main>
  );
}
