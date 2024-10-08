import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PersonalInfoForm } from '../Profile/PersonalInfoForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Power } from 'lucide-react';

const UserActions = ({ user, isMasterAdmin, onEdit, onToggleStatus, onDelete }) => {
  if (user.role === 'Master') return null;

  return (
    <div className="flex space-x-2">
      {(isMasterAdmin || (user.role !== 'Admin' && user.role !== 'Master')) && (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit User Profile</DialogTitle>
              </DialogHeader>
              <PersonalInfoForm user={user} updateUserContext={onEdit} />
            </DialogContent>
          </Dialog>
          
          {isMasterAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(user.id, user.status)}
              >
                <Power className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user
                      account and remove all associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(user.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserActions;