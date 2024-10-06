import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EstoqueForm = ({ novoProduto, handleInputChange, handleFileChange, handleSubmit, calcularMarkup }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="titulo" value={novoProduto.titulo} onChange={handleInputChange} placeholder="Título do Produto" />
      <Input name="sku" value={novoProduto.sku} onChange={handleInputChange} placeholder="SKU" />
      <Textarea name="descricao" value={novoProduto.descricao} onChange={handleInputChange} placeholder="Descrição" />
      <Input type="number" name="estoque" value={novoProduto.estoque} onChange={handleInputChange} placeholder="Estoque" />
      <div className="flex space-x-2">
        <Input type="number" name="preco" value={novoProduto.preco} onChange={handleInputChange} placeholder="Preço do Produto" />
        <Input type="number" name="desconto" value={novoProduto.desconto} onChange={handleInputChange} placeholder="Desconto" />
        <Select name="tipoDesconto" value={novoProduto.tipoDesconto} onValueChange={(value) => handleInputChange({ target: { name: 'tipoDesconto', value }})}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Desconto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="%">%</SelectItem>
            <SelectItem value="R$">R$</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Input type="number" name="vendaSugerida" value={novoProduto.vendaSugerida} onChange={handleInputChange} placeholder="Venda Sugerida" />
      <div>Markup: {calcularMarkup()}</div>
      <div>
        <label htmlFor="fotos" className="block text-sm font-medium text-gray-700">
          Fotos do Produto
        </label>
        <Input id="fotos" type="file" multiple onChange={handleFileChange} className="mt-1" />
      </div>
      {novoProduto.fotos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {novoProduto.fotos.map((foto, index) => (
            <img key={index} src={foto} alt={`Produto ${index + 1}`} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}
      <Button type="submit">{novoProduto.id ? 'Atualizar Produto' : 'Salvar Produto'}</Button>
    </form>
  );
};

export default EstoqueForm;