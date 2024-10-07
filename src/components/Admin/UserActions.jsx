import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Power, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UserActions = ({ user, isMasterAdmin, onUserUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRoleChange = async (newRole) => {
    try {
      await firebaseOperations.updateUserRole(user.id, newRole);
      onUserUpdate();
      toast({ title: "Role Updated", description: `User role has been updated to ${newRole}.`, variant: "success" });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({ title: "Error", description: "Failed to update user role. Please try again.", variant: "destructive" });
    }
  };

  const handleToggleUserStatus = async () => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await firebaseOperations.updateUserStatus(user.id, newStatus);
      onUserUpdate();
      toast({ title: "Status Updated", description: `User status has been updated to ${newStatus}.`, variant: "success" });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({ title: "Error", description: "Failed to update user status. Please try again.", variant: "destructive" });
    }
  };

  const handlePasswordReset = async () => {
    try {
      await firebaseOperations.sendPasswordResetEmail(user.email);
      toast({ title: "Password Reset", description: "Password reset email has been sent.", variant: "success" });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast({ title: "Error", description: "Failed to send password reset email. Please try again.", variant: "destructive" });
    }
  };

  if (user.role === 'Master') return null;

  return (
    <div className="flex space-x-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>User's personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div><strong>Name:</strong> {user.name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Phone:</strong> {user.phone || 'Not provided'}</div>
                    <div><strong>Address:</strong> {user.address || 'Not provided'}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>User's notification settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div><strong>Email Notifications:</strong> {user.emailNotifications ? 'Enabled' : 'Disabled'}</div>
                    <div><strong>Push Notifications:</strong> {user.pushNotifications ? 'Enabled' : 'Disabled'}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="mt-4 space-y-2">
            <Select onValueChange={handleRoleChange} defaultValue={user.role}>
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vendedor">Vendedor</SelectItem>
                <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                {isMasterAdmin && <SelectItem value="Master">Master</SelectItem>}
              </SelectContent>
            </Select>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleToggleUserStatus}>
                <Power className="mr-2 h-4 w-4" />
                {user.status === 'Active' ? 'Deactivate' : 'Activate'} Account
              </Button>
              <Button variant="outline" onClick={handlePasswordReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserActions;