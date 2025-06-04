
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Realizations from "@/components/sections/Realizations";
import Partners from "@/components/sections/Partners";
import Reviews from "@/components/sections/Reviews";
import Contact from "@/components/sections/Contact";
import QuoteForm from "@/components/sections/QuoteForm";
import Footer from "@/components/sections/Footer";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <Realizations />
      <Partners />
      <Reviews />
      <Contact />
      <QuoteForm />
      <Footer />
    </div>
  );
};

export default Index;
