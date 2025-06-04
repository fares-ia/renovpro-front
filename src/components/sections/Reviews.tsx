
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Reviews = () => {
  const reviews = [
    {
      rating: 5,
      title: "Travail exceptionnel",
      comment: "RenovPro a rénové entièrement notre appartement. Le travail est d'une qualité exceptionnelle, les délais ont été respectés et l'équipe est très professionnelle. Je recommande vivement !",
      author: "Marie Dubois",
      city: "Paris"
    },
    {
      rating: 5,
      title: "Très satisfait",
      comment: "Excellent travail pour la rénovation de notre local commercial. L'équipe a été à l'écoute de nos besoins et le résultat dépasse nos attentes. Prix très correct.",
      author: "Pierre Martin",
      city: "Antony"
    },
    {
      rating: 5,
      title: "Je recommande",
      comment: "Rénovation de notre salle de bain parfaitement réalisée. Travail soigné, équipe ponctuelle et respectueuse. Nous ferons appel à eux pour nos prochains travaux.",
      author: "Sophie Leroy",
      city: "Fresnes"
    },
    {
      rating: 4,
      title: "Bon travail",
      comment: "Peinture de notre maison réalisée dans les temps. Quelques petits détails à revoir mais dans l'ensemble nous sommes satisfaits du résultat.",
      author: "Jean-Luc Bernard",
      city: "Cachan"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Avis de nos Clients</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que nos clients pensent de nos services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-500">{review.city}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 italic">"{review.comment}"</p>
                <p className="text-sm font-medium text-yellow-600">- {review.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
