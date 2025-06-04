import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClientInfo } from "../CreateQuoteForm";
import { useState } from "react";

interface ClientInfoStepProps {
  clientInfo: ClientInfo;
  onChange: (info: ClientInfo) => void;
}

const ClientInfoStep = ({ clientInfo, onChange }: ClientInfoStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Expressions régulières pour la validation
  const patterns = {
    name: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^(\+33|0)[1-9](\d{2}){4}$/,
    postalCode: /^\d{5}$/,
    city: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/,
    address: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9,.\s-]{5,100}$/
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!patterns.name.test(value)) {
          error = 'Le nom doit contenir entre 2 et 50 caractères (lettres, tirets, apostrophes)';
        }
        break;
      case 'email':
        if (!patterns.email.test(value)) {
          error = 'Veuillez saisir une adresse email valide';
        }
        break;
      case 'phone':
        if (!patterns.phone.test(value)) {
          error = 'Veuillez saisir un numéro de téléphone valide (format: +33 ou 0 suivi de 9 chiffres)';
        }
        break;
      case 'postalCode':
        if (!patterns.postalCode.test(value)) {
          error = 'Le code postal doit contenir exactement 5 chiffres';
        }
        break;
      case 'city':
        if (!patterns.city.test(value)) {
          error = 'La ville doit contenir entre 2 et 50 caractères (lettres, tirets, apostrophes)';
        }
        break;
      case 'address':
        if (!patterns.address.test(value)) {
          error = 'L\'adresse doit contenir entre 5 et 100 caractères';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleChange = (field: keyof ClientInfo, value: string) => {
    validateField(field, value);
    onChange({ ...clientInfo, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Type de client</Label>
        <RadioGroup
          value={clientInfo.type}
          onValueChange={(value: 'particulier' | 'professionnel') => handleChange('type', value)}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="particulier" id="particulier" />
            <Label htmlFor="particulier">Particulier</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="professionnel" id="professionnel" />
            <Label htmlFor="professionnel">Professionnel</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={clientInfo.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={clientInfo.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={clientInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            value={clientInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="address">Adresse *</Label>
        <Input
          id="address"
          value={clientInfo.address}
          onChange={(e) => handleChange('address', e.target.value)}
          required
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postalCode">Code postal *</Label>
          <Input
            id="postalCode"
            value={clientInfo.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            required
            className={errors.postalCode ? "border-red-500" : ""}
          />
          {errors.postalCode && (
            <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>
          )}
        </div>
        <div>
          <Label htmlFor="city">Ville *</Label>
          <Input
            id="city"
            value={clientInfo.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city}</p>
          )}
        </div>
      </div>

      {clientInfo.type === 'professionnel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Raison sociale *</Label>
            <Input
              id="companyName"
              value={clientInfo.companyName || ''}
              onChange={(e) => handleChange('companyName', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="siret">SIRET *</Label>
            <Input
              id="siret"
              value={clientInfo.siret || ''}
              onChange={(e) => handleChange('siret', e.target.value)}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInfoStep;
