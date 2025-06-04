
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToQuote = () => {
    const element = document.querySelector("#quote");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1697946594607-04d755acff2b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-yellow-500">RenovPro</span>
        </h1>
        <p className="text-xl md:text-2xl mb-4 text-yellow-400">The Best Partner</p>
        <p className="text-lg md:text-xl mb-8 leading-relaxed">
          Votre partenaire de confiance pour tous vos travaux de rénovation. 
          De la simple peinture à la rénovation complète, nous transformons vos espaces 
          avec professionnalisme et excellence.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button 
            size="lg" 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg"
            onClick={scrollToQuote}
          >
            Obtenir un Devis Gratuit
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-yellow-500 text-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-black px-8 py-4 text-lg font-semibold"
            onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
          >
            Découvrir nos Services
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-2xl font-bold text-yellow-500">Assurance</h3>
            <p className="text-lg">Tous risques chantier</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-500">Devis</h3>
            <p className="text-lg">Gratuit sous 24h</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-500">Urgence</h3>
            <p className="text-lg">Intervention 7j/7</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
