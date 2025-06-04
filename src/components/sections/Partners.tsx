
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Partners = () => {
  const partners = [
    {
      name: "Leroy Merlin",
      contact: "contact@leroymerlin.fr",
      description: "Partenaire matériaux et outillage"
    },
    {
      name: "Castorama",
      contact: "pro@castorama.fr",
      description: "Fourniture équipements professionnels"
    },
    {
      name: "Point P",
      contact: "commercial@pointp.fr",
      description: "Matériaux de construction"
    },
    {
      name: "Brico Dépôt",
      contact: "pro@bricodepot.fr",
      description: "Solutions professionnelles"
    }
  ];

  return (
    <section id="partners" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Partenaires</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nous travaillons avec les meilleures enseignes pour vous garantir qualité et prix
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">{partner.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">{partner.description}</p>
                <p className="text-sm text-yellow-600 font-medium">{partner.contact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
