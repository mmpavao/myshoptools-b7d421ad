import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { updateUserProfile, uploadProfileImage } from '../../firebase/firebaseOperations';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [phone, setPhone] = useState(user?.phoneNumber?.slice(3) || '');
  const [address, setAddress] = useState(user?.address || '');
  const [country, setCountry] = useState(countries.find(c => c.ddi === user?.phoneNumber?.slice(0, 3)) || countries[0]);
  const [profileImage, setProfileImage] = useState(user?.photoURL || "/placeholder.svg");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const downloadURL = await uploadProfileImage(file, user.uid);
        setProfileImage(downloadURL);
        toast({
          title: "Imagem de Perfil Atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a imagem de perfil.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedUserData = {
        displayName: name,
        email,
        phoneNumber: `${country.ddi}${phone}`,
        address,
        country: country.code,
        photoURL: profileImage,
      };
      await updateUserProfile(user.uid, updatedUserData);
      updateUserContext(updatedUserData);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileImage} alt="Profile" />
            <AvatarFallback>{name[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="picture" className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500">
              Alterar foto
            </Label>
            <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>
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
      <Button type="submit" className="mt-6" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
};