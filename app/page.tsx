import { Suspense } from "react";
import Home from "./components/home";
import Navbar from "@/app/components/layout/navbar";
import About from "@/app/components/about/about";
import Projects from "@/app/components/projects/project";
import Contact from "@/app/components/contact/contact";
import Footer from "@/app/components/layout/footer";
import BackToTop from "./components/ui/back-to-top";

export default function Page() {
  return (
    <main className="relative bg-slate-950 w-full overflow-x-hidden">
      <Navbar />
      <Home />
      <About />
      <Suspense fallback={<div>Loading...</div>}>
        <Projects />
      </Suspense>
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}
