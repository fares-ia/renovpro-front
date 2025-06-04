import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import ClientInfoStep from "./quote-steps/ClientInfoStep";
import QuoteInfoStep from "./quote-steps/QuoteInfoStep";
import PrestationsStep from "./quote-steps/PrestationsStep";
import { dataStore } from "@/store/dataStore";

export interface ClientInfo {
  type: 'particulier' | 'professionnel';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  companyName?: string;
  siret?: string;
}

export interface QuoteInfo {
  number: string;
  emissionDate: string;
  validityDate: string;
  workAddress: string;
  workCity: string;
  workPostalCode: string;
  sameAsClientAddress: boolean;
}

export interface Prestation {
  id: string;
  category: string;
  description: string;
  technicalDetails: string;
  quantity: number;
  unit: string;
  unitPriceHT: number;
  tvaRate: number;
  isFree: boolean;
}

interface CreateQuoteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateQuoteForm = ({ onClose, onSuccess }: CreateQuoteFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    type: 'particulier',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo>({
    number: '',
    emissionDate: new Date().toISOString().split('T')[0],
    validityDate: '',
    workAddress: '',
    workCity: '',
    workPostalCode: '',
    sameAsClientAddress: true,
  });
  const [prestations, setPrestations] = useState<Prestation[]>([]);

  const generateQuoteNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const counter = Math.floor(Math.random() * 999) + 1;
    return `R${year}${counter.toString().padStart(3, '0')}`;
  };

  const calculateValidityDate = (emissionDate: string) => {
    const date = new Date(emissionDate);
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Génération automatique du numéro et date de validité à l'étape 2
      if (!quoteInfo.number) {
        setQuoteInfo(prev => ({
          ...prev,
          number: generateQuoteNumber(),
          validityDate: calculateValidityDate(prev.emissionDate),
        }));
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCreateQuote = async () => {
    try {
      const cleanPrestations = prestations
        .filter(p => p.category && p.description)
        .map(({ id, ...rest }) => rest);

      // Correction ici :
      let cleanQuoteInfo = { ...quoteInfo };
      if (quoteInfo.sameAsClientAddress) {
        cleanQuoteInfo = {
          ...quoteInfo,
          workAddress: clientInfo.address,
          workCity: clientInfo.city,
          workPostalCode: clientInfo.postalCode
        };
      }

      const quoteData = {
        clientInfo,
        quoteInfo: cleanQuoteInfo,
        prestations: cleanPrestations,
        status: 'draft' as const,
        createdAt: new Date().toISOString()
      };

      console.log("Payload envoyé à l'API /api/full-quotes:", quoteData);

      await dataStore.createFullQuote(quoteData);

      toast({
        title: "Devis créé",
        description: `Le devis ${quoteInfo.number} a été créé avec succès`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de la création du devis:", error);
      toast({
        title: "Erreur",
        description: error?.error?.message || "Impossible de créer le devis",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientInfoStep
            clientInfo={clientInfo}
            onChange={setClientInfo}
          />
        );
      case 2:
        return (
          <QuoteInfoStep
            quoteInfo={quoteInfo}
            onChange={setQuoteInfo}
            clientInfo={clientInfo}
          />
        );
      case 3:
        return (
          <PrestationsStep
            prestations={prestations}
            onChange={setPrestations}
          />
        );
      default:
        return null;
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        // Vérification des champs obligatoires et de leur validité
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'postalCode', 'city'];
        const isValid = requiredFields.every(field => {
          const value = clientInfo[field as keyof ClientInfo];
          return value && value.length > 0;
        });

        // Vérification des champs spécifiques aux professionnels
        if (clientInfo.type === 'professionnel') {
          return isValid && clientInfo.companyName && clientInfo.siret;
        }

        return isValid;
      case 2:
        return quoteInfo.number && quoteInfo.emissionDate && quoteInfo.validityDate;
      case 3:
        return prestations.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Création de devis - Étape {currentStep}/3
          </CardTitle>
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded ${step <= currentStep ? 'bg-yellow-500' : 'bg-gray-200'
                  }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrev}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
          )}
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {currentStep < 3 ? (
            <Button onClick={handleNext} disabled={!canGoNext()}>
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleCreateQuote} disabled={!canGoNext()}>
              Créer le devis
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuoteForm;
