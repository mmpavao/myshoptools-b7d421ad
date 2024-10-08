import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from '../ui/button';

const TaskList = ({ tasks }) => (
  <Card>
    <CardHeader>
      <CardTitle>Tarefas</CardTitle>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="pendentes">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
        </TabsList>
        <TabsContent value="pendentes">
          {tasks.filter(t => !t.concluida).map((tarefa, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span>{tarefa.descricao}</span>
              <Button size="sm">Concluir</Button>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="concluidas">
          {tasks.filter(t => t.concluida).map((tarefa, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="line-through">{tarefa.descricao}</span>
              <span className="text-sm text-gray-500">{tarefa.dataConclusao}</span>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

export default TaskList;