
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Settings as SettingsIcon, Bell, Shield, Database, Key, Save } from 'lucide-react';

const Settings = () => {
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 md:grid-cols-4 h-auto">
          <TabsTrigger value="general" className="flex gap-2 items-center">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex gap-2 items-center">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex gap-2 items-center">
            <Key className="h-4 w-4" />
            <span className="hidden md:inline">API</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" defaultValue="John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" defaultValue="john.smith@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" placeholder="Your role" defaultValue="Compliance Officer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="Your department" defaultValue="Risk & Compliance" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">User Interface</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable dark mode for the application
                      </p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use more compact layout for tables and lists
                      </p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Settings</CardTitle>
              <CardDescription>
                Configure compliance check thresholds and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Compliance Sources</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pep-check">PEP Screening</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable PEP screening during client onboarding
                      </p>
                    </div>
                    <Switch id="pep-check" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="adverse-media">Adverse Media Check</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable adverse media screening
                      </p>
                    </div>
                    <Switch id="adverse-media" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sanctions">Sanctions Screening</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable international sanctions screening
                      </p>
                    </div>
                    <Switch id="sanctions" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Data Retention</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="retention-period">Client Data Retention (months)</Label>
                    <Input id="retention-period" type="number" min="1" max="120" defaultValue="60" />
                    <p className="text-xs text-muted-foreground">
                      Period to retain client data after client relationship ends
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="log-retention">Audit Log Retention (months)</Label>
                    <Input id="log-retention" type="number" min="1" max="120" defaultValue="84" />
                    <p className="text-xs text-muted-foreground">
                      Period to retain compliance activity logs
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage alerts and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-clients">New Clients</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email when new clients are added
                      </p>
                    </div>
                    <Switch id="new-clients" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compliance-alerts">Compliance Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email for flagged compliance issues
                      </p>
                    </div>
                    <Switch id="compliance-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="document-uploads">Document Uploads</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email when documents need review
                      </p>
                    </div>
                    <Switch id="document-uploads" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">In-App Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="task-reminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Show reminders for pending tasks
                      </p>
                    </div>
                    <Switch id="task-reminders" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify about system and feature updates
                      </p>
                    </div>
                    <Switch id="system-updates" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Manage API keys and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">API Keys</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex">
                      <Input id="api-key" type="password" value="sk_test_4eC39HqLyjWDarjtT1zdp7dc" readOnly className="font-mono" />
                      <Button variant="outline" className="ml-2">Copy</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use this key to authenticate API requests
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Generate New Key
                    </Button>
                    <Button variant="outline" size="sm">
                      Revoke Key
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">External Integrations</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="aml-integration">AML Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Connect to external AML services
                      </p>
                    </div>
                    <Switch id="aml-integration" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ocr-integration">OCR Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Connect to document scanning services
                      </p>
                    </div>
                    <Switch id="ocr-integration" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="crm-integration">CRM Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Connect to customer relationship management
                      </p>
                    </div>
                    <Switch id="crm-integration" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://yourcompany.com/api/webhooks" />
                <p className="text-xs text-muted-foreground">
                  Webhook notifications will be sent to this URL
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
