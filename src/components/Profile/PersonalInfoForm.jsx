import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '../Auth/AuthProvider';
import AvatarEditor from './AvatarEditor';
import { countries, getPhoneInputValue } from '../../utils/formUtils';
import { loadUserProfile, updateUserProfile } from '../../utils/profileUtils';

const PersonalInfoForm = () => {
  const { user, updateUserContext } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '',
    country: countries[0], profileImage: "/placeholder.svg"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.uid) {
        setIsLoading(true);
        const profile = await loadUserProfile(user.uid);
        if (profile) {
          setFormData(profile);
        } else {
          console.error('Perfil do usuário não encontrado');
        }
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone' ? value.replace(/\D/g, '') : value
    }));
  };

  const handleCountryChange = (value) => {
    const selectedCountry = countries.find(c => c.code === value);
    setFormData(prev => ({ ...prev, country: selectedCountry, phone: '' }));
  };

  const onAvatarSave = (newAvatarUrl) => {
    setFormData(prev => ({ ...prev, profileImage: newAvatarUrl }));
    updateUserContext({ photoURL: newAvatarUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateUserProfile(user.uid, formData, updateUserContext);
    setIsSubmitting(false);
  };

  if (isLoading) return <div>Carregando dados do perfil...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={formData.profileImage} alt="Profile" />
            <AvatarFallback>{formData.name[0] || 'U'}</AvatarFallback>
          </Avatar>
          <AvatarEditor onSave={onAvatarSave} currentAvatar={formData.profileImage} />
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
                    <SelectItem key={c.code} value={c.code}>{c.flag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-grow ml-2 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {formData.country.ddi}
                </span>
                <Input
                  id="phone" name="phone" type="tel"
                  value={getPhoneInputValue(formData.phone, formData.country)}
                  onChange={handleChange} className="pl-10"
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