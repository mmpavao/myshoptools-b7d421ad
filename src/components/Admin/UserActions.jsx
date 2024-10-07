import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Power, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import firebaseOperations from '../../firebase/firebaseOperations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UserActions = ({ user, isMasterAdmin, onUserUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.status === 'Active');
  const [hasChanges, setHasChanges] = useState(false);

  const handleRoleChange = (value) => {
    setNewRole(value);
    setHasChanges(true);
  };

  const handleToggleUserStatus = () => {
    setIsActive(!isActive);
    setHasChanges(true);
  };

  const handlePasswordReset = async () => {
    try {
      await firebaseOperations.sendPasswordResetEmail(user.email);
      toast({
        title: "Password Reset",
        description: `Instructions sent to ${user.email}`,
        variant: "success"
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      await firebaseOperations.updateUserSettings(user.id, {
        role: newRole,
        status: isActive ? 'Active' : 'Inactive'
      });
      onUserUpdate();
      setIsDialogOpen(false);
      setHasChanges(false);
      toast({
        title: "Changes Saved",
        description: "User settings have been updated successfully.",
        variant: "success"
      });
    } catch (error) {
      console.error('Error updating user settings:', error);
      toast({
        title: "Error",
        description: "Failed to update user settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (user.role === 'Master') return null;

  return (
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
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>Manage user role and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>User Role</span>
                  <Select onValueChange={handleRoleChange} defaultValue={user.role}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vendedor">Vendedor</SelectItem>
                      <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      {isMasterAdmin && <SelectItem value="Master">Master</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <span>Account Status</span>
                  <Switch
                    checked={isActive}
                    onCheckedChange={handleToggleUserStatus}
                    className={isActive ? "bg-green-500" : "bg-gray-200"}
                  />
                </div>
                <Button variant="outline" onClick={handlePasswordReset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveChanges} disabled={!hasChanges}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserActions;