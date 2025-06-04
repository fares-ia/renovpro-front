import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { dataStore, type Realization } from "@/store/dataStore";
import { Pencil, Trash2, Plus } from "lucide-react";

interface AdminRealizationsProps {
  onUpdate: () => void;
}

const AdminRealizations = ({ onUpdate }: AdminRealizationsProps) => {
  const { toast } = useToast();
  const [realizations, setRealizations] = useState<Realization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRealization, setEditingRealization] = useState<Realization | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: "",
    city: "",
    date: ""
  });

  useEffect(() => {
    loadRealizations();
  }, []);

  const loadRealizations = async () => {
    setIsLoading(true);
    try {
      const data = await dataStore.getRealizations();
      setRealizations(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les réalisations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const realizationData = {
        ...formData,
        images: formData.images.split(',').map(url => url.trim()).filter(url => url)
      };

      if (editingRealization) {
        await dataStore.updateRealization(editingRealization._id, realizationData);
        toast({
          title: "Réalisation mise à jour",
          description: "La réalisation a été modifiée avec succès",
        });
      } else {
        await dataStore.createRealization(realizationData);
        toast({
          title: "Réalisation créée",
          description: "La nouvelle réalisation a été ajoutée avec succès",
        });
      }
      
      await loadRealizations();
      onUpdate();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (realization: Realization) => {
    setEditingRealization(realization);
    setFormData({
      title: realization.title,
      description: realization.description,
      images: realization.images.join(', '),
      city: realization.city,
      date: realization.date
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réalisation ?")) {
      return;
    }

    setIsLoading(true);
    try {
      await dataStore.deleteRealization(id);
      await loadRealizations();
      onUpdate();
      toast({
        title: "Réalisation supprimée",
        description: "La réalisation a été supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réalisation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingRealization(null);
    setFormData({
      title: "",
      description: "",
      images: "",
      city: "",
      date: ""
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Réalisations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une Réalisation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRealization ? "Modifier la réalisation" : "Nouvelle réalisation"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">URLs des images (séparées par des virgules)</Label>
                <Textarea
                  id="images"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://image1.jpg, https://image2.jpg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="ex: Octobre 2024"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sauvegarde..." : (editingRealization ? "Modifier" : "Créer")}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && !isDialogOpen ? (
        <div className="text-center py-8">
          <p>Chargement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {realizations.map((realization) => (
            <Card key={realization._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{realization.title}</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(realization)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(realization._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <img 
                    src={realization.images[0]} 
                    alt={realization.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="text-sm text-gray-600">{realization.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{realization.city}</span>
                    <span>{realization.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRealizations;
