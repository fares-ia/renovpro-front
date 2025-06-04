
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Realizations = () => {
  const realizations = [
    {
      title: "Rénovation complète appartement Haussmannien",
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"
      ],
      description: "Rénovation complète d'un appartement de 120m² avec création d'espaces ouverts, réfection complète de la plomberie et de l'électricité.",
      city: "Paris 16ème",
      date: "Mars 2024"
    },
    {
      title: "Transformation local commercial",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop"
      ],
      description: "Aménagement complet d'un local commercial de 200m² avec création de bureaux modernes, éclairage LED et climatisation.",
      city: "Fresnes",
      date: "Février 2024"
    },
    {
      title: "Rénovation maison individuelle",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&h=400&fit=crop"
      ],
      description: "Rénovation énergétique complète d'une maison de 150m² avec isolation, changement des fenêtres et modernisation du système de chauffage.",
      city: "Antony",
      date: "Janvier 2024"
    }
  ];

  return (
    <section id="realizations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Réalisations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez quelques-uns de nos projets récents
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {realizations.map((realization, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={realization.images[0]} 
                  alt={realization.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">{realization.title}</CardTitle>
                <CardDescription className="text-yellow-600 font-medium">
                  {realization.city} • {realization.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{realization.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Realizations;
