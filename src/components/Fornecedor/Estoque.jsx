import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Eye, Upload } from 'lucide-react';
import { createProduct, getProducts, updateProduct, deleteProduct, uploadProductImage } from '../../firebase/firebaseOperations';
import { toast } from "@/components/ui/use-toast";

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, variacoes: [], vendaSugerida: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const produtosData = await getProducts();
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(file => uploadProductImage(file, 'temp'));
    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      setNovoProduto(prev => ({ ...prev, fotos: [...prev.fotos, ...uploadedUrls] }));
    } catch (error) {
      console.error("Erro ao fazer upload das imagens:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar as imagens.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(novoProduto);
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso!",
      });
      fetchProdutos();
      setIsDialogOpen(false);
      setNovoProduto({
        titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, variacoes: [], vendaSugerida: 0
      });
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto.",
        variant: "destructive",
      });
    }
  };

  const calcularMarkup = () => {
    const markup = novoProduto.vendaSugerida / novoProduto.preco;
    return markup.toFixed(1) + 'x';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estoque</h1>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>Novo Produto</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"><Checkbox /></TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto.id}>
              <TableCell><Checkbox /></TableCell>
              <TableCell>{produto.sku}</TableCell>
              <TableCell>{produto.titulo}</TableCell>
              <TableCell>R$ {produto.preco}</TableCell>
              <TableCell>{produto.estoque}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => deleteProduct(produto.id)}><Trash2 className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Estoque;