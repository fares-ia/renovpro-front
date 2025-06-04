
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const QuoteForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    workType: "",
    propertyType: "",
    budget: "",
    startDate: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.address || !formData.workType || 
        !formData.propertyType || !formData.startDate || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse e-mail valide",
        variant: "destructive"
      });
      return;
    }

    console.log("Formulaire de devis soumis :", formData);
    
    toast({
      title: "Demande de devis envoyée !",
      description: "Nous vous contacterons dans les plus brefs délais.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      address: "",
      workType: "",
      propertyType: "",
      budget: "",
      startDate: "",
      description: ""
    });
  };

  return (
    <section id="quote" className="py-20 bg-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Obtenir un Devis Gratuit</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Décrivez votre projet et recevez une estimation personnalisée
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900">
              Formulaire de Demande de Devis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse e-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse du bien à rénover *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Adresse complète du chantier"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Type de travaux *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, workType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type de travaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="renovation-globale">Rénovation globale</SelectItem>
                      <SelectItem value="renovation-partielle">Rénovation partielle</SelectItem>
                      <SelectItem value="extension">Extension</SelectItem>
                      <SelectItem value="rafraichissement">Rafraîchissement</SelectItem>
                      <SelectItem value="reparation-pose">Réparation ou pose simple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Type de bien *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type de bien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="local-commercial">Local commercial</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="immeuble">Immeuble</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (optionnel)</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Ex: 15 000€"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de démarrage souhaitée *</Label>
                  <Input
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="Ex: Mars 2024"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description des travaux *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez précisément les travaux à réaliser..."
                  rows={5}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 text-lg"
              >
                Envoyer ma Demande de Devis
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuoteForm;
