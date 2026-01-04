import AboutSection from "./home/AboutSection";
import BannerSection from "./home/BannerSection";
import ContactSection from "./home/ContactSection";
import ProjectSection from "./home/ProjectSection";

export default function Home() {
  return (
    <main>
      <BannerSection />
      <AboutSection />
      <ProjectSection />
      <ContactSection />
    </main>
  );
}
