import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const RatingForm = ({ avaliacaoAtual, setAvaliacaoAtual, handleSubmitAvaliacao }) => {
  return (
    <div className="mt-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Avaliar Produto</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${star <= avaliacaoAtual.nota ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setAvaliacaoAtual(prev => ({ ...prev, nota: star }))}
                />
              ))}
            </div>
            <Textarea
              placeholder="Deixe seu comentário"
              value={avaliacaoAtual.comentario}
              onChange={(e) => setAvaliacaoAtual(prev => ({ ...prev, comentario: e.target.value }))}
            />
            <Button onClick={handleSubmitAvaliacao}>Enviar Avaliação</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RatingForm;