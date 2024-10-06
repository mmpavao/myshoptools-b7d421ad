import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatCurrency, parseCurrency } from '../../utils/currencyUtils';

const EstoqueForm = ({ novoProduto, handleInputChange, handleFileChange, handleSubmit, calcularMarkup }) => {
  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseCurrency(value);
    handleInputChange({ target: { name, value: numericValue } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título do Produto</Label>
        <Input id="titulo" name="titulo" value={novoProduto.titulo} onChange={handleInputChange} placeholder="Ex: Smartphone XYZ" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input id="sku" name="sku" value={novoProduto.sku} onChange={handleInputChange} placeholder="Ex: PROD-001" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" name="descricao" value={novoProduto.descricao} onChange={handleInputChange} placeholder="Descreva as características do produto" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estoque">Quantidade em Estoque</Label>
        <Input id="estoque" type="number" name="estoque" value={novoProduto.estoque} onChange={handleInputChange} placeholder="0" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preco">Preço de Custo</Label>
          <Input
            id="preco"
            name="preco"
            value={formatCurrency(novoProduto.preco)}
            onChange={handleCurrencyChange}
            placeholder="R$ 0,00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendaSugerida">Preço de Venda Sugerido</Label>
          <Input
            id="vendaSugerida"
            name="vendaSugerida"
            value={formatCurrency(novoProduto.vendaSugerida)}
            onChange={handleCurrencyChange}
            placeholder="R$ 0,00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="desconto">Desconto</Label>
          <Input
            id="desconto"
            name="desconto"
            value={novoProduto.desconto}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipoDesconto">Tipo de Desconto</Label>
          <Select
            id="tipoDesconto"
            name="tipoDesconto"
            value={novoProduto.tipoDesconto}
            onValueChange={(value) => handleInputChange({ target: { name: 'tipoDesconto', value }})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="%">Porcentagem (%)</SelectItem>
              <SelectItem value="R$">Valor Fixo (R$)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Markup Calculado</Label>
        <div className="text-lg font-semibold text-green-600">{calcularMarkup()}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fotos">Fotos do Produto</Label>
        <Input id="fotos" type="file" multiple onChange={handleFileChange} className="cursor-pointer" />
      </div>

      {novoProduto.fotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {novoProduto.fotos.map((foto, index) => (
            <img key={index} src={foto} alt={`Produto ${index + 1}`} className="w-full h-32 object-cover rounded" />
          ))}
        </div>
      )}

      <Button type="submit" className="w-full">
        {novoProduto.id ? 'Atualizar Produto' : 'Salvar Produto'}
      </Button>
    </form>
  );
};

export default EstoqueForm;