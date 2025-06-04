
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nous sommes là pour répondre à toutes vos questions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-yellow-500" />
                  <span>Téléphone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">+33 (0) 771 209 997</p>
                <p className="text-gray-600">Lundi - Vendredi : 8h - 18h</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-yellow-500" />
                  <span>E-mail</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">contact@renov-pro.eu</p>
                <p className="text-gray-600">Réponse sous 24h</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-yellow-500" />
                  <span>Adresse</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">85 avenue de la liberté</p>
                <p className="text-lg font-medium">94260 Fresnes, France</p>
                <p className="text-gray-600">SIREN : 930972328</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2627.5!2d2.3296!3d48.7569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671b9b7b4a5f7%3A0x5!2s85%20Av.%20de%20la%20Libert%C3%A9%2C%2094260%20Fresnes!5e0!3m2!1sfr!2sfr!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation RenovPro"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
