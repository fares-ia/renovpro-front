
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      title: "Peinture",
      description: "Transformation et mise en valeur esthétique avec matériaux durables",
      details: "Peindre les murs, plafonds, boiseries, meubles, cuisines, salles de bains, sols intérieurs.",
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&h=300&fit=crop"
    },
    {
      title: "Électricité",
      description: "Installation, dépannage, recherche de pannes",
      details: "Électricité générale, éclairage, ventilateurs de plafond, tableau électrique.",
      image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Plomberie",
      description: "Détection et réparation des fuites, nouvelles installations",
      details: "Plomberie générale, chauffe-eau, traitement de l'eau.",
      image: "https://images.unsplash.com/photo-1620653713380-7a34b773fef8?q=80&w=2745&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Finition intérieure",
      description: "Travail hautement qualitatif avec nettoyage impeccable",
      details: "Cloisons sèches, isolation, maçonnerie, moulures et menuiseries.",
      image: "https://images.unsplash.com/photo-1721824321238-386a1fb50d2b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une expertise complète pour tous vos projets de rénovation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                <CardDescription className="text-yellow-600 font-medium">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
