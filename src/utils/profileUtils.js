import { countries, formatPhoneNumber } from './formUtils';
import firebaseOperations from '../firebase/firebaseOperations';
import { toast } from "@/components/ui/use-toast";

export const loadUserProfile = async (userId) => {
  try {
    const userProfile = await firebaseOperations.getUserById(userId);
    if (userProfile) {
      const phoneNumber = userProfile.phoneNumber || '';
      const country = countries.find(c => phoneNumber.startsWith(c.ddi)) || countries[0];
      return {
        name: userProfile.displayName || '',
        email: userProfile.email || '',
        phone: phoneNumber.slice(country.ddi.length).replace(/\D/g, ''),
        address: userProfile.address || '',
        profileImage: userProfile.photoURL || "/placeholder.svg",
        country: country,
      };
    }
    console.error('Perfil do usuário não encontrado');
    return null;
  } catch (error) {
    console.error('Erro ao carregar perfil do usuário:', error);
    toast({
      title: "Erro",
      description: "Não foi possível carregar os dados do perfil.",
      variant: "destructive",
    });
    return null;
  }
};

export const updateUserProfile = async (userId, formData, updateUserContext) => {
  try {
    const updatedUserData = {
      displayName: formData.name,
      email: formData.email,
      phoneNumber: formatPhoneNumber(formData.phone, formData.country),
      address: formData.address,
      country: formData.country.code,
      photoURL: formData.profileImage,
    };
    await firebaseOperations.updateUserProfile(userId, updatedUserData);
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
  }
};