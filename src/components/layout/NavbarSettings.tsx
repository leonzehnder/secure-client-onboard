import React, { useState, useEffect } from 'react';
import { Settings, X, Save, Key } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from '@/hooks/use-toast';
import { getApiSettings } from '@/services/aiApiService';

export type ApiProvider = 'openai' | 'anthropic';

interface NavbarSettingsProps {
  onSettingsSaved?: () => void;
}

const NavbarSettings: React.FC<NavbarSettingsProps> = ({ onSettingsSaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<ApiProvider>('openai');
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage when component mounts or dialog opens
  useEffect(() => {
    if (isOpen) {
      const { apiKey: savedApiKey, provider: savedProvider } = getApiSettings();
      
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
      
      if (savedProvider) {
        setProvider(savedProvider);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API key is required",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('chat_api_key', apiKey);
    localStorage.setItem('chat_api_provider', provider);
    
    toast({
      title: "Settings Saved",
      description: "Your API settings have been saved",
    });
    
    if (onSettingsSaved) {
      onSettingsSaved();
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" 
          size="icon" 
          className="text-gray-600 hover:bg-gray-50 rounded-full h-9 w-9"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Configure your AI API provider and key
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="provider">API Provider</Label>
            <RadioGroup 
              value={provider} 
              onValueChange={(value) => setProvider(value as ApiProvider)}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="openai" id="openai" />
                <Label htmlFor="openai" className="font-normal">OpenAI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anthropic" id="anthropic" />
                <Label htmlFor="anthropic" className="font-normal">Anthropic (Claude)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="apiKey"
                type="password"
                placeholder={`Your ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {provider === 'openai' 
                ? 'Your OpenAI API key from platform.openai.com'
                : 'Your Anthropic API key from console.anthropic.com'}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NavbarSettings;