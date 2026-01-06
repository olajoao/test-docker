/**
 * Componente Settings
 * Dialog para configuração das credenciais SIP e opções avançadas do JsSIP
 * 
 * Migrado de: lib/components/Settings.jsx
 * Mudanças principais:
 * - Class Component → Function Component  
 * - Material-UI → shadcn/ui (Dialog, Input, Select, Switch)
 * - State interno → Zustand + useState local
 * - Stylus → TailwindCSS
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useWebRTCStore } from '../stores/webrtc-store';
import { createLogger } from '../lib/logger';
import type { WebRTCSettings } from '../types';

const logger = createLogger('Settings');

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings: storeSettings, setSettings } = useWebRTCStore();
  
  // Estado local para edição
  const [localSettings, setLocalSettings] = useState<WebRTCSettings>(storeSettings);

  // Sincronizar com store quando abre o dialog
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(JSON.parse(JSON.stringify(storeSettings)));
    }
  }, [isOpen, storeSettings]);

  // Handlers para mudanças
  const handleChange = (path: string, value: any) => {
    setLocalSettings((prev) => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Submit
  const handleSubmit = () => {
    logger.debug('handleSubmit() - saving settings');
    
    // Salvar no Zustand store (que já persiste no localStorage com chave 'settings')
    setSettings(localSettings);
    
    onClose();
  };

  // Cancel
  const handleCancel = () => {
    logger.debug('handleCancel()');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">WebRTC Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* JsSIP UA Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">JsSIP UA Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="sip-uri">SIP URI</Label>
              <Input
                id="sip-uri"
                type="text"
                placeholder="sip:user@domain.com"
                value={localSettings.uri || ''}
                onChange={(e) => handleChange('uri', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sip-password">SIP Password</Label>
              <Input
                id="sip-password"
                type="password"
                placeholder="Enter password"
                value={localSettings.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websocket-uri">WebSocket URI</Label>
              <Input
                id="websocket-uri"
                type="text"
                placeholder="wss://server.com:443"
                value={localSettings.socket.uri || ''}
                onChange={(e) => handleChange('socket.uri', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="via-transport">Via Transport</Label>
              <Select
                value={localSettings.socket.via_transport || 'auto'}
                onValueChange={(value) => handleChange('socket.via_transport', value)}
              >
                <SelectTrigger id="via-transport">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="ws">WS</SelectItem>
                  <SelectItem value="wss">WSS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrar-server">Registrar Server (optional)</Label>
              <Input
                id="registrar-server"
                type="text"
                placeholder="sip:registrar.com"
                value={localSettings.registrar_server || ''}
                onChange={(e) => handleChange('registrar_server', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-uri">Contact URI (optional)</Label>
              <Input
                id="contact-uri"
                type="text"
                placeholder="sip:contact@domain.com"
                value={localSettings.contact_uri || ''}
                onChange={(e) => handleChange('contact_uri', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorization-user">Authorization User (optional)</Label>
              <Input
                id="authorization-user"
                type="text"
                placeholder="username"
                value={localSettings.authorization_user || ''}
                onChange={(e) => handleChange('authorization_user', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instance-id">Instance ID (optional)</Label>
              <Input
                id="instance-id"
                type="text"
                placeholder="unique-instance-id"
                value={localSettings.instance_id || ''}
                onChange={(e) => handleChange('instance_id', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Advanced Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced Options</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timers</Label>
                <p className="text-sm text-muted-foreground">
                  Enable Session Timers as per RFC 4028
                </p>
              </div>
              <Switch
                checked={localSettings.session_timers}
                onCheckedChange={(checked) => handleChange('session_timers', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Preloaded Route</Label>
                <p className="text-sm text-muted-foreground">
                  Add a Route header with the server URI
                </p>
              </div>
              <Switch
                checked={localSettings.use_preloaded_route}
                onCheckedChange={(checked) => handleChange('use_preloaded_route', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Callstats.io Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Callstats.io Settings</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enabled</Label>
                <p className="text-sm text-muted-foreground">
                  Send call statistics to callstats.io
                </p>
              </div>
              <Switch
                checked={localSettings.callstats.enabled}
                onCheckedChange={(checked) => handleChange('callstats.enabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="callstats-appid">App ID</Label>
              <Input
                id="callstats-appid"
                type="text"
                placeholder="Enter App ID"
                disabled={!localSettings.callstats.enabled}
                value={localSettings.callstats.AppID || ''}
                onChange={(e) => handleChange('callstats.AppID', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="callstats-appsecret">App Secret</Label>
              <Input
                id="callstats-appsecret"
                type="password"
                placeholder="Enter App Secret"
                disabled={!localSettings.callstats.enabled}
                value={localSettings.callstats.AppSecret || ''}
                onChange={(e) => handleChange('callstats.AppSecret', e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
