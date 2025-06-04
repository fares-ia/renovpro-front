import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src="/footer-logo.png" alt="Logo RenovPro" className="h-12 mb-4 mx-auto md:mx-0" />
            {/* <h3 className="text-2xl font-bold text-yellow-500 mb-4">RenovPro</h3> */}
            <p className="text-gray-300 mb-4">The Best Partner</p>
            <p className="text-gray-400">
              Votre partenaire de confiance pour tous vos travaux de rénovation. 
              Excellence, professionnalisme et satisfaction client garantis.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-500" />
                <span>+33 (0) 771 209 997</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-500" />
                <span>contact@renov-pro.eu</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-yellow-500" />
                <span>85 avenue de la liberté, 94260 Fresnes</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Peinture</li>
              <li>Électricité</li>
              <li>Plomberie</li>
              <li>Finition intérieure</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} RenovPro. Tous droits réservés. SIREN : 930972328
            </p>
            <p className="text-gray-400 mt-4 md:mt-0">
              ce site est réalisé par{" "}
              <a 
                href="https://prodysoft.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                Prodysoft
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
