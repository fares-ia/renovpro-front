import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { dataStore, type Review } from "@/store/dataStore";
import { Pencil, Trash2, Plus, Star } from "lucide-react";

interface AdminReviewsProps {
  onUpdate: () => void;
}

const AdminReviews = ({ onUpdate }: AdminReviewsProps) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    rating: 5,
    title: "",
    content: "",
    date: ""
  });

  useEffect(() => {
    loadReviews();
  }, []);

  // Fonction pour vérifier si un ID est temporaire
  const isTemporaryId = (id: string | undefined) => {
    if (!id) return true;
    return id.startsWith('temp-');
  };

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await dataStore.getReviews();
      console.log('Avis reçus:', data);
      setReviews(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis",
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
      if (editingReview?._id) {
        await dataStore.updateReview(editingReview._id, formData);
        toast({
          title: "Avis mis à jour",
          description: "L'avis a été modifié avec succès",
        });
      } else {
        await dataStore.createReview(formData);
        toast({
          title: "Avis créé",
          description: "Le nouvel avis a été ajouté avec succès",
        });
      }
      
      await loadReviews();
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

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      author: review.author,
      rating: review.rating,
      title: review.title,
      content: review.content,
      date: review.date
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast({
        title: "Erreur",
        description: "ID d'avis invalide",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      return;
    }

    setIsLoading(true);
    try {
      await dataStore.deleteReview(id);
      await loadReviews();
      onUpdate();
      toast({
        title: "Avis supprimé",
        description: "L'avis a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingReview(null);
    setFormData({
      author: "",
      rating: 5,
      title: "",
      content: "",
      date: ""
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Avis</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Avis
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? "Modifier l'avis" : "Nouvel avis"}
              </DialogTitle>
              <DialogDescription>
                {editingReview ? "Modifiez les informations de l'avis existant" : "Remplissez les informations pour créer un nouvel avis"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author">Auteur</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Note</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} étoile{rating > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="ex: 15 novembre 2024"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sauvegarde..." : (editingReview ? "Modifier" : "Créer")}
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
          {reviews.map((review) => (
            <Card key={review._id || review.date}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">par {review.author}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(review)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(review._id)}
                      disabled={!review._id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{review.content}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
