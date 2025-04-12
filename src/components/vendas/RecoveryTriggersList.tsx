
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Clock, Edit, Copy, Trash, MoreVertical, MessageSquare, Mail, Rocket } from "lucide-react";
import { RecoveryTrigger, TRIGGER_EVENTS, DELAY_OPTIONS } from "@/types/recovery";
import RecoveryTriggerForm from './RecoveryTriggerForm';

interface RecoveryTriggersListProps {
  type: 'email' | 'sms';
  triggers: RecoveryTrigger[];
  onSave: (trigger: RecoveryTrigger) => void;
  onDelete: (id: string) => void;
}

const RecoveryTriggersList: React.FC<RecoveryTriggersListProps> = ({ 
  type, 
  triggers, 
  onSave, 
  onDelete 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<RecoveryTrigger | null>(null);
  const [triggerToDelete, setTriggerToDelete] = useState<string | null>(null);

  const handleSave = (trigger: RecoveryTrigger) => {
    onSave(trigger);
    setIsAdding(false);
    setEditingTrigger(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingTrigger(null);
  };

  const confirmDelete = () => {
    if (triggerToDelete) {
      onDelete(triggerToDelete);
      setTriggerToDelete(null);
    }
  };

  const duplicateTrigger = (trigger: RecoveryTrigger) => {
    const newTrigger = {
      ...trigger,
      id: `${trigger.id}-copy-${Date.now()}`,
      subject: type === 'email' && trigger.subject ? `${trigger.subject} (cópia)` : undefined,
    };
    onSave(newTrigger);
  };

  // If we're adding or editing, show the form
  if (isAdding || editingTrigger) {
    return (
      <RecoveryTriggerForm
        type={type}
        existingTrigger={editingTrigger || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={onDelete}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <Rocket className="h-5 w-5 mr-2" />
          Automações configuradas
        </h3>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova automação
        </Button>
      </div>

      {triggers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-muted p-3 mb-3">
              {type === 'email' ? (
                <Mail className="h-8 w-8 text-muted-foreground" />
              ) : (
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-1">Nenhuma automação configurada</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              Configure automações para enviar mensagens em momentos estratégicos 
              e aumentar suas conversões.
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar primeira automação
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {triggers.map((trigger) => (
            <Card key={trigger.id} className={`relative ${!trigger.active ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-base">
                      {TRIGGER_EVENTS[trigger.event]}
                      {!trigger.active && (
                        <Badge variant="outline" className="ml-2">
                          Inativo
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1 inline" />
                      Enviar após: {trigger.delay === 'instant' ? 'Instantâneo' : DELAY_OPTIONS[trigger.delay as keyof typeof DELAY_OPTIONS]}
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTrigger(trigger)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateTrigger(trigger)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setTriggerToDelete(trigger.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <Separator className="my-2" />
                {type === 'email' && trigger.subject && (
                  <div className="font-medium text-sm mb-1">{trigger.subject}</div>
                )}
                <div className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3 mb-2">
                  {trigger.message}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setEditingTrigger(trigger)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar automação
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={triggerToDelete !== null} onOpenChange={(open) => !open && setTriggerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir automação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta automação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecoveryTriggersList;
