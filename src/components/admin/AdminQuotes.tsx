import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { dataStore, type Quote, type FullQuote } from "@/store/dataStore";
import { Eye, FileText, Mail, Plus, Download } from "lucide-react";
import CreateQuoteForm from "./CreateQuoteForm";
import { generateQuotePDF } from "@/services/pdfService";

interface AdminQuotesProps {
  onUpdate: () => void;
}

const AdminQuotes = ({ onUpdate }: AdminQuotesProps) => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [fullQuotes, setFullQuotes] = useState<FullQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setIsLoading(true);
    try {
      const [basicQuotes, detailedQuotes] = await Promise.all([
        dataStore.getQuotes(),
        dataStore.getFullQuotes()
      ]);
      console.log('Devis détaillés reçus:', detailedQuotes);
      setQuotes(basicQuotes);
      // S'assurer que chaque devis a un ID
      const quotesWithIds = detailedQuotes.map((quote, index) => {
        console.log('Devis avant modification:', quote);
        const modifiedQuote = {
          ...quote,
          id: quote.id || `temp-${index}-${Date.now()}`
        };
        console.log('Devis après modification:', modifiedQuote);
        return modifiedQuote;
      });
      setFullQuotes(quotesWithIds);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les devis",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (quoteId: string, newStatus: Quote['status']) => {
    try {
      await dataStore.updateQuoteStatus(quoteId, newStatus);
      await loadQuotes();
      onUpdate();
      toast({
        title: "Statut mis à jour",
        description: "Le statut du devis a été modifié avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const handleFullQuoteStatusChange = async (quoteId: string, newStatus: FullQuote['status']) => {
    if (!quoteId || quoteId.startsWith('temp-')) {
      toast({
        title: "Erreur",
        description: "Ce devis ne peut pas être modifié car il n'a pas encore été sauvegardé",
        variant: "destructive",
      });
      return;
    }

    try {
      await dataStore.updateFullQuoteStatus(quoteId, newStatus);
      await loadQuotes();
      onUpdate();
      toast({
        title: "Statut mis à jour",
        description: "Le statut du devis a été modifié avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Quote['status'] | FullQuote['status']) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "secondary" as const },
      draft: { label: "Brouillon", variant: "outline" as const },
      sent: { label: "Envoyé", variant: "default" as const },
      accepted: { label: "Accepté", variant: "default" as const },
      rejected: { label: "Refusé", variant: "destructive" as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewQuote = (quote: Quote | FullQuote) => {
    const clientName = 'name' in quote ? quote.name : `${quote.clientInfo.firstName} ${quote.clientInfo.lastName}`;
    toast({
      title: "Aperçu du devis",
      description: `Ouverture du devis pour ${clientName}`,
    });
  };

  const handleSendEmail = (quote: Quote | FullQuote) => {
    const email = 'email' in quote ? quote.email : quote.clientInfo.email;
    toast({
      title: "Email envoyé",
      description: `Devis envoyé à ${email}`,
    });
  };

  const handleDownloadPDF = (quote: FullQuote) => {
    const quoteWithIds = {
      ...quote,
      createdAt: quote.createdAt || new Date().toISOString(),
      status: quote.status || 'draft',
      prestations: quote.prestations.map((p, index) => ({
        ...p,
        id: `temp-${index}`
      }))
    };
    generateQuotePDF(quoteWithIds);
    toast({
      title: "PDF généré",
      description: `Devis ${quote.quoteInfo.number} téléchargé`,
    });
  };

  const handleGenerateInvoice = (quote: Quote | FullQuote) => {
    const quoteNumber = 'id' in quote && 'quoteInfo' in quote ? quote.quoteInfo.number : quote.id;
    toast({
      title: "Facture générée",
      description: `Facture créée pour le devis ${quoteNumber}`,
    });
  };

  const handleCreateSuccess = () => {
    loadQuotes();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Devis</h2>
        <div className="space-x-2">
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un Devis
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-500">
              {fullQuotes.filter(q => q.status === 'draft').length}
            </div>
            <p className="text-sm text-gray-600">Brouillons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-500">
              {fullQuotes.filter(q => q.status === 'sent').length}
            </div>
            <p className="text-sm text-gray-600">Envoyés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">
              {fullQuotes.filter(q => q.status === 'accepted').length}
            </div>
            <p className="text-sm text-gray-600">Acceptés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-500">
              {fullQuotes.filter(q => q.status === 'rejected').length}
            </div>
            <p className="text-sm text-gray-600">Refusés</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Chargement...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Devis complets */}
          {fullQuotes.map((quote) => (
            <Card key={quote.id || quote.quoteInfo.number}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {quote.clientInfo.firstName} {quote.clientInfo.lastName}
                      <Badge variant="outline" className="ml-2">Devis {quote.quoteInfo.number}</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-500">{quote.clientInfo.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(quote.status)}
                    <Select
                      value={quote.status}
                      onValueChange={(value: FullQuote['status']) => handleFullQuoteStatusChange(quote.id || '', value)}
                      disabled={!quote.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="sent">Envoyé</SelectItem>
                        <SelectItem value="accepted">Accepté</SelectItem>
                        <SelectItem value="rejected">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Adresse client :</strong> {quote.clientInfo.address}, {quote.clientInfo.postalCode} {quote.clientInfo.city}
                    </div>
                    <div>
                      <strong>Téléphone :</strong> {quote.clientInfo.phone}
                    </div>
                    <div>
                      <strong>Date d'émission :</strong> {quote.quoteInfo.emissionDate}
                    </div>
                    <div>
                      <strong>Date de validité :</strong> {quote.quoteInfo.validityDate}
                    </div>
                    <div>
                      <strong>Nombre de prestations :</strong> {quote.prestations.length}
                    </div>
                    <div>
                      <strong>Total :</strong> {quote.prestations.reduce((sum, p) => sum + (p.isFree ? 0 : p.quantity * p.unitPriceHT), 0).toFixed(2)}€ HT
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewQuote(quote)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Aperçu
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(quote)}>
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger PDF
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleSendEmail(quote)}>
                      <Mail className="h-4 w-4 mr-1" />
                      Envoyer par email
                    </Button>
                    {quote.status === 'accepted' && (
                      <Button size="sm" onClick={() => handleGenerateInvoice(quote)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Générer facture
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Devis simples existants */}
          {quotes.map((quote) => (
            <Card key={quote.id || quote.email}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{quote.name}</CardTitle>
                    <p className="text-sm text-gray-500">{quote.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(quote.status)}
                    <Select
                      value={quote.status}
                      onValueChange={(value: Quote['status']) => handleStatusChange(quote.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="sent">Envoyé</SelectItem>
                        <SelectItem value="accepted">Accepté</SelectItem>
                        <SelectItem value="rejected">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Adresse :</strong> {quote.address}
                    </div>
                    <div>
                      <strong>Type de travaux :</strong> {quote.workType}
                    </div>
                    <div>
                      <strong>Type de bien :</strong> {quote.propertyType}
                    </div>
                    <div>
                      <strong>Date souhaitée :</strong> {quote.startDate}
                    </div>
                    {quote.budget && (
                      <div>
                        <strong>Budget :</strong> {quote.budget}
                      </div>
                    )}
                    <div>
                      <strong>Créé le :</strong> {quote.createdAt}
                    </div>
                  </div>
                  
                  <div>
                    <strong>Description :</strong>
                    <p className="text-sm text-gray-600 mt-1">{quote.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewQuote(quote)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Aperçu
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleSendEmail(quote)}>
                      <Mail className="h-4 w-4 mr-1" />
                      Envoyer par email
                    </Button>
                    {quote.status === 'accepted' && (
                      <Button size="sm" onClick={() => handleGenerateInvoice(quote)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Générer facture
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {quotes.length === 0 && fullQuotes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun devis pour le moment</p>
            </div>
          )}
        </div>
      )}

      {/* Dialog pour création de devis */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau devis</DialogTitle>
          </DialogHeader>
          <CreateQuoteForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuotes;
