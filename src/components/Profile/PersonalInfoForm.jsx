import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { updateUserProfile } from '../../firebase/firebaseOperations';

const countries = [
  { code: 'BR', flag: '🇧🇷', ddi: '+55' },
  { code: 'US', flag: '🇺🇸', ddi: '+1' },
  { code: 'CN', flag: '🇨🇳', ddi: '+86' },
  { code: 'MX', flag: '🇲🇽', ddi: '+52' },
  { code: 'CO', flag: '🇨🇴', ddi: '+57' },
  { code: 'CA', flag: '🇨🇦', ddi: '+1' },
  { code: 'AU', flag: '🇦🇺', ddi: '+61' },
  { code: 'ID', flag: '🇮🇩', ddi: '+62' },
];

export const PersonalInfoForm = ({ user, updateUserContext }) => {
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState(countries[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(user.uid, {
        displayName: name,
        email,
        phone: `${country.ddi}${phone}`,
        address,
        country: country.code,
      });
      updateUserContext({ displayName: name });
      toast({
        title: "Perfil Atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <div className="flex">
              <Select value={country.code} onValueChange={(value) => setCountry(countries.find(c => c.code === value))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.ddi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-grow ml-2"
              />
            </div>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
      </div>
      <Button type="submit" className="mt-6">Salvar Alterações</Button>
    </form>
  );
};