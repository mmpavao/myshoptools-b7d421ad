import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const MockCheckout = ({ isOpen, onClose, plan }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically process the payment
    console.log('Processing payment for:', plan);
    console.log('Form data:', formData);
    // Mock successful payment
    alert('Pagamento processado com sucesso! Obrigado por escolher nossos serviços.');
    onClose();
  };

  // Check if plan is null or undefined
  if (!plan) {
    return null; // Or you could return a message like "No plan selected"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout - {plan.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <Input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="expiry">Validade</Label>
              <Input id="expiry" name="expiry" placeholder="MM/AA" value={formData.expiry} onChange={handleInputChange} required />
            </div>
            <div className="flex-1">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" name="cvc" value={formData.cvc} onChange={handleInputChange} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Pagar R$ {plan.price}/mês</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MockCheckout;