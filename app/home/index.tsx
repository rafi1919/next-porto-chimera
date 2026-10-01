import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ContentSection from "../components/Section/ContentSection";


export default function Home() {
    return (
        <div className="grid min-h-dvh grid-rows-[1fr_auto]">
            {/* <Navbar /> */}
            <ContentSection />
            <Footer />
        </div>
    );
}

