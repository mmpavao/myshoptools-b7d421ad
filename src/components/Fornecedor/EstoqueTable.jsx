import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UserProfile from '../Profile/UserProfile';

const EstoqueTable = ({ produtos, onDelete, onDetalhes, onEdit, isMasterUser }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"><Checkbox /></TableHead>
            <TableHead className="w-[80px]">Foto</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Estoque</TableHead>
            {isMasterUser && <TableHead>Usuário</TableHead>}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto.id} className="h-20">
              <TableCell><Checkbox /></TableCell>
              <TableCell>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={produto.fotos?.[0] || ''} alt={produto.titulo} />
                  <AvatarFallback>{produto.titulo.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{produto.sku}</TableCell>
              <TableCell>{produto.titulo}</TableCell>
              <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
              <TableCell>{produto.estoque}</TableCell>
              {isMasterUser && (
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0">
                        <User className="h-4 w-4 mr-2" />
                        {produto.userName || 'Usuário'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Perfil do Usuário</DialogTitle>
                      </DialogHeader>
                      <UserProfile userId={produto.userId} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onDetalhes(produto.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {!isMasterUser && (
                    <>
                      <Button variant="outline" size="icon" onClick={() => onEdit(produto)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => onDelete(produto.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EstoqueTable;