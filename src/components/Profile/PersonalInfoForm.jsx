import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '../Auth/AuthProvider';
import AvatarEditor from './AvatarEditor';
import { countries, formatPhoneNumber } from '../../utils/formUtils';
import { updateSpecificUserAvatar } from '../../utils/updateSpecificUserAvatar';

export const PersonalInfoForm = () => {
  const { user, updateUserContext } = useAuth();
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
    if (user && user.uid) {
      loadUserProfile(user.uid);
    }
  }, [user]);

  useEffect(() => {
    // Atualizar avatar para o usuário específico (marcio@talkmaker.io)
    const updateAvatar = async () => {
      if (user && user.email === 'marcio@talkmaker.io') {
        const avatarUrl = 'https://firebasestorage.googleapis.com/v0/b/myshoptools-84ff5.appspot.com/o/avatars%2FDALL%C2%B7E%202024-09-15%2023.22.44%20-%20An%20illustration%20of%20a%20character%20named%20\'Mr.%20Shop\'%2C%20representing%20an%20experienced%20and%20friendly%20e-commerce%20mentor.%20He%20is%20a%2040-year-old%20man%20wearing%20a%20blue%20dr.webp?alt=media&token=bfd7b3b3-d352-47eb-869d-7a7b49c1295c';
        try {
          await updateSpecificUserAvatar(user.email, avatarUrl);
          setFormData(prev => ({ ...prev, profileImage: avatarUrl }));
        } catch (error) {
          console.error('Erro ao atualizar avatar específico:', error);
        }
      }
    };
    updateAvatar();
  }, [user]);

  const loadUserProfile = async (userId) => {
    try {
      const userProfile = await firebaseOperations.getUserProfile(userId);
      if (userProfile) {
        const phoneNumber = userProfile.phoneNumber || '';
        const country = countries.find(c => phoneNumber.startsWith(c.ddi)) || countries[0];
        setFormData({
          name: userProfile.displayName || '',
          email: userProfile.email || '',
          phone: phoneNumber.slice(country.ddi.length).replace(/\D/g, ''),
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCountryChange = (value) => {
    const selectedCountry = countries.find(c => c.code === value);
    setFormData(prev => ({ ...prev, country: selectedCountry, phone: '' }));
  };

  const handleAvatarSave = async (downloadURL) => {
    setFormData(prev => ({ ...prev, profileImage: downloadURL }));
    updateUserContext({ photoURL: downloadURL });
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
      await firebaseOperations.updateUserProfile(user.uid, updatedUserData);
      updateUserContext(updatedUserData);
      toast({
        title: "Perfil Atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPhoneInputValue = () => {
    if (formData.country.code === 'US') {
      const cleaned = formData.phone.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        const parts = [match[1], match[2], match[3]].filter(Boolean);
        if (parts.length === 0) return '';
        return `(${parts[0]})${parts[1] ? ' ' + parts[1] : ''}${parts[2] ? '-' + parts[2] : ''}`;
      }
    }
    return formData.phone;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={formData.profileImage} alt="Profile" />
            <AvatarFallback>{formData.name[0] || 'U'}</AvatarFallback>
          </Avatar>
          <AvatarEditor onSave={handleAvatarSave} />
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
              <div className="flex-grow ml-2 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {formData.country.ddi}
                </span>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={getPhoneInputValue()}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Número de telefone"
                />
              </div>
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

export default PersonalInfoForm;