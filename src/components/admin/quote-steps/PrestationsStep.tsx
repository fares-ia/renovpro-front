
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { Prestation } from "../CreateQuoteForm";

interface PrestationsStepProps {
  prestations: Prestation[];
  onChange: (prestations: Prestation[]) => void;
}

const PrestationsStep = ({ prestations, onChange }: PrestationsStepProps) => {
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const defaultCategories = [
    "Peinture",
    "Électricité", 
    "Plomberie",
    "Finition intérieure",
    "Menuiserie",
    "Carrelage",
    "Isolation",
    "Chauffage"
  ];

  const allCategories = [...defaultCategories, ...customCategories];

  const defaultUnits = ["pièce", "m²", "m", "L", "jour", "forfait", "h"];

  const addCustomCategory = () => {
    if (newCategoryName.trim() && !allCategories.includes(newCategoryName.trim())) {
      setCustomCategories([...customCategories, newCategoryName.trim()]);
      setNewCategoryName("");
    }
  };

  const addPrestation = () => {
    const newPrestation: Prestation = {
      id: Date.now().toString(),
      category: "",
      description: "",
      technicalDetails: "",
      quantity: 1,
      unit: "pièce",
      unitPriceHT: 0,
      tvaRate: 20,
      isFree: false,
    };
    onChange([...prestations, newPrestation]);
  };

  const updatePrestation = (id: string, updates: Partial<Prestation>) => {
    onChange(prestations.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removePrestation = (id: string) => {
    onChange(prestations.filter(p => p.id !== id));
  };

  const calculateTotal = () => {
    return prestations.reduce((sum, p) => {
      if (p.isFree) return sum;
      const totalHT = p.quantity * p.unitPriceHT;
      const totalTTC = totalHT * (1 + p.tvaRate / 100);
      return sum + totalTTC;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Prestations et services</h3>
        <div className="text-lg font-bold">
          Total TTC: {calculateTotal().toFixed(2)}€
        </div>
      </div>

      {/* Ajout de catégorie personnalisée */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ajouter une catégorie personnalisée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nom de la catégorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
            />
            <Button onClick={addCustomCategory} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {prestations.map((prestation) => (
        <Card key={prestation.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">Prestation</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removePrestation(prestation.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`category-${prestation.id}`}>Catégorie</Label>
                <Select
                  value={prestation.category}
                  onValueChange={(value) => updatePrestation(prestation.id, { category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`description-${prestation.id}`}>Description</Label>
                <Input
                  id={`description-${prestation.id}`}
                  value={prestation.description}
                  onChange={(e) => updatePrestation(prestation.id, { description: e.target.value })}
                  placeholder="Description de la prestation"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`technical-${prestation.id}`}>Détails techniques</Label>
              <Textarea
                id={`technical-${prestation.id}`}
                value={prestation.technicalDetails}
                onChange={(e) => updatePrestation(prestation.id, { technicalDetails: e.target.value })}
                placeholder="Matériaux, techniques, spécifications..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor={`quantity-${prestation.id}`}>Quantité</Label>
                <Input
                  id={`quantity-${prestation.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={prestation.quantity}
                  onChange={(e) => updatePrestation(prestation.id, { quantity: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor={`unit-${prestation.id}`}>Unité</Label>
                <Select
                  value={prestation.unit}
                  onValueChange={(value) => updatePrestation(prestation.id, { unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`price-${prestation.id}`}>Prix unitaire HT</Label>
                <Input
                  id={`price-${prestation.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={prestation.unitPriceHT}
                  onChange={(e) => updatePrestation(prestation.id, { unitPriceHT: parseFloat(e.target.value) || 0 })}
                  disabled={prestation.isFree}
                />
              </div>
              <div>
                <Label htmlFor={`tva-${prestation.id}`}>TVA (%)</Label>
                <Select
                  value={prestation.tvaRate.toString()}
                  onValueChange={(value) => updatePrestation(prestation.id, { tvaRate: parseFloat(value) })}
                  disabled={prestation.isFree}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="5.5">5.5%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`free-${prestation.id}`}
                    checked={prestation.isFree}
                    onCheckedChange={(checked) => updatePrestation(prestation.id, { isFree: checked as boolean })}
                  />
                  <Label htmlFor={`free-${prestation.id}`} className="text-sm">
                    Offert
                  </Label>
                </div>
              </div>
            </div>

            {!prestation.isFree && (
              <div className="text-right">
                <span className="font-semibold">
                  Total TTC: {(prestation.quantity * prestation.unitPriceHT * (1 + prestation.tvaRate / 100)).toFixed(2)}€
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button onClick={addPrestation} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une prestation
      </Button>
    </div>
  );
};

export default PrestationsStep;
