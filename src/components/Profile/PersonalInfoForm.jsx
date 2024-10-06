import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { updateUserProfile, uploadProfileImage, getUserProfile } from '../../firebase/firebaseOperations';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: countries[0],
    profileImage: "/placeholder.svg"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && user.uid) {
        try {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            const phoneNumber = userProfile.phoneNumber || '';
            const country = countries.find(c => phoneNumber.startsWith(c.ddi)) || countries[0];
            setFormData({
              name: userProfile.displayName || '',
              email: userProfile.email || '',
              phone: phoneNumber.slice(country.ddi.length),
              address: userProfile.address || '',
              profileImage: userProfile.photoURL || "/placeholder.svg",
              country: country,
            });
          }
        } catch (error) {
          console.error('Erro ao carregar perfil do usuário:', error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do perfil.",
            variant: "destructive",
          });
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value) => {
    const selectedCountry = countries.find(c => c.code === value);
    setFormData(prev => ({ ...prev, country: selectedCountry }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const downloadURL = await uploadProfileImage(file, user.uid);
        setFormData(prev => ({ ...prev, profileImage: downloadURL }));
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

  const formatPhoneNumber = (phoneNumber, country) => {
    if (country.code === 'US') {
      const cleaned = ('' + phoneNumber).replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `${country.ddi} (${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return `${country.ddi}${phoneNumber}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedUserData = {
        displayName: formData.name,
        email: formData.email,
        phoneNumber: formatPhoneNumber(formData.phone, formData.country),
        address: formData.address,
        country: formData.country.code,
        photoURL: formData.profileImage,
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
            <AvatarImage src={formData.profileImage} alt="Profile" />
            <AvatarFallback>{formData.name[0] || 'U'}</AvatarFallback>
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
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <div className="flex">
              <Select value={formData.country.code} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue>{formData.country.flag}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="flex-grow ml-2"
                placeholder={`${formData.country.ddi} Número de telefone`}
              />
            </div>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>
        </div>
      </div>
      <Button type="submit" className="mt-6" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
};