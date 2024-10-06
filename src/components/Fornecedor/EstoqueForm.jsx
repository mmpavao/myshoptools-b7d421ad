import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatCurrency, parseCurrency } from '../../utils/currencyUtils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const EstoqueForm = ({ novoProduto, handleInputChange, handleFileChange, handleSubmit, calcularMarkup, updateFotos }) => {
  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseCurrency(value);
    handleInputChange({ target: { name, value: numericValue } });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(novoProduto.fotos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateFotos(items);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Produto</Label>
          <Input id="titulo" name="titulo" value={novoProduto.titulo} onChange={handleInputChange} placeholder="Ex: Smartphone XYZ" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" value={novoProduto.sku} onChange={handleInputChange} placeholder="Ex: PROD-001" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" name="descricao" value={novoProduto.descricao} onChange={handleInputChange} placeholder="Descreva as características do produto" className="h-20" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estoque">Quantidade em Estoque</Label>
          <Input id="estoque" type="number" name="estoque" value={novoProduto.estoque} onChange={handleInputChange} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preco">Preço de Custo</Label>
          <Input id="preco" name="preco" value={formatCurrency(novoProduto.preco)} onChange={handleCurrencyChange} placeholder="R$ 0,00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendaSugerida">Preço de Venda Sugerido</Label>
          <Input id="vendaSugerida" name="vendaSugerida" value={formatCurrency(novoProduto.vendaSugerida)} onChange={handleCurrencyChange} placeholder="R$ 0,00" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="desconto">Desconto</Label>
          <Input id="desconto" name="desconto" value={novoProduto.desconto} onChange={handleInputChange} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipoDesconto">Tipo de Desconto</Label>
          <Select id="tipoDesconto" name="tipoDesconto" value={novoProduto.tipoDesconto} onValueChange={(value) => handleInputChange({ target: { name: 'tipoDesconto', value }})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="%">Porcentagem (%)</SelectItem>
              <SelectItem value="R$">Valor Fixo (R$)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Markup Calculado</Label>
          <div className="text-lg font-semibold text-green-600 pt-2">{calcularMarkup()}</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fotos">Fotos do Produto</Label>
        <Input id="fotos" type="file" multiple onChange={handleFileChange} className="cursor-pointer" />
      </div>

      {novoProduto.fotos.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fotos" direction="horizontal">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-2 mt-2">
                {novoProduto.fotos.map((foto, index) => (
                  <Draggable key={foto} draggableId={foto} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="relative">
                        <img src={foto} alt={`Produto ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                        {index === 0 && (
                          <div className="absolute top-0 left-0 bg-primary text-white px-2 py-1 text-xs rounded-br">
                            Capa
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Button type="submit" className="w-full">
        {novoProduto.id ? 'Atualizar Produto' : 'Salvar Produto'}
      </Button>
    </form>
  );
};

export default EstoqueForm;