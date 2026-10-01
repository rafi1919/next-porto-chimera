import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


export default function Home() {
    return (
        <section className="grid min-h-dvh grid-rows-[1fr_auto]">
            <Navbar />
            <div className="mt-auto">
                <Footer />
            </div>
        </section>
    );
}

