import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const EstoqueForm = ({ novoProduto, handleInputChange, handleFileChange, handleSubmit, calcularMarkup }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="titulo" value={novoProduto.titulo} onChange={handleInputChange} placeholder="Título do Produto" />
      <Input name="sku" value={novoProduto.sku} onChange={handleInputChange} placeholder="SKU" />
      <Textarea name="descricao" value={novoProduto.descricao} onChange={handleInputChange} placeholder="Descrição" />
      <Input type="number" name="estoque" value={novoProduto.estoque} onChange={handleInputChange} placeholder="Estoque" />
      <Input type="number" name="preco" value={novoProduto.preco} onChange={handleInputChange} placeholder="Preço do Produto" />
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
      <Button type="submit">Salvar Produto</Button>
    </form>
  );
};

export default EstoqueForm;