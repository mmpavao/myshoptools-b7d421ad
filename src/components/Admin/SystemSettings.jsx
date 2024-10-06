import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SystemSettings = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
        <CardDescription>Configure your platform's basic information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platformName">Platform Name</Label>
          <Input id="platformName" placeholder="MyShopTools" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <Input id="logo" type="file" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="favicon">Favicon</Label>
          <Input id="favicon" type="file" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="socialBanner">Social Share Banner</Label>
          <Input id="socialBanner" type="file" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Input id="seoDescription" placeholder="Enter SEO description" />
        </div>
        <div className="space-y-2">
          <Label>Color Scheme</Label>
          {/* Add color palette selection here */}
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  </div>
);

export default SystemSettings;
