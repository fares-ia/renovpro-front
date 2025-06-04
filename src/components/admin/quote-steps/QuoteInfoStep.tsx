
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { QuoteInfo, ClientInfo } from "../CreateQuoteForm";

interface QuoteInfoStepProps {
  quoteInfo: QuoteInfo;
  onChange: (info: QuoteInfo) => void;
  clientInfo: ClientInfo;
}

const QuoteInfoStep = ({ quoteInfo, onChange, clientInfo }: QuoteInfoStepProps) => {
  const handleChange = (field: keyof QuoteInfo, value: string | boolean) => {
    const updated = { ...quoteInfo, [field]: value };
    
    // Si on coche "même adresse", copier l'adresse du client
    if (field === 'sameAsClientAddress' && value === true) {
      updated.workAddress = clientInfo.address;
      updated.workCity = clientInfo.city;
      updated.workPostalCode = clientInfo.postalCode;
    }
    
    // Recalculer la date de validité si la date d'émission change
    if (field === 'emissionDate') {
      const date = new Date(value as string);
      date.setMonth(date.getMonth() + 1);
      date.setDate(date.getDate() - 1);
      updated.validityDate = date.toISOString().split('T')[0];
    }
    
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="number">Numéro de devis</Label>
          <Input
            id="number"
            value={quoteInfo.number}
            onChange={(e) => handleChange('number', e.target.value)}
            placeholder="Généré automatiquement"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="emissionDate">Date d'émission</Label>
          <Input
            id="emissionDate"
            type="date"
            value={quoteInfo.emissionDate}
            onChange={(e) => handleChange('emissionDate', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="validityDate">Date de validité</Label>
          <Input
            id="validityDate"
            type="date"
            value={quoteInfo.validityDate}
            onChange={(e) => handleChange('validityDate', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sameAddress"
            checked={quoteInfo.sameAsClientAddress}
            onCheckedChange={(checked) => handleChange('sameAsClientAddress', checked)}
          />
          <Label htmlFor="sameAddress">Même adresse que le client</Label>
        </div>

        {!quoteInfo.sameAsClientAddress && (
          <>
            <div>
              <Label htmlFor="workAddress">Adresse du chantier</Label>
              <Input
                id="workAddress"
                value={quoteInfo.workAddress}
                onChange={(e) => handleChange('workAddress', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workPostalCode">Code postal</Label>
                <Input
                  id="workPostalCode"
                  value={quoteInfo.workPostalCode}
                  onChange={(e) => handleChange('workPostalCode', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="workCity">Ville</Label>
                <Input
                  id="workCity"
                  value={quoteInfo.workCity}
                  onChange={(e) => handleChange('workCity', e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuoteInfoStep;
