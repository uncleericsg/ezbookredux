import React from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/Switch';
import type { AdminSettings } from '../../types/settings';

interface CypressSettingsProps {
  settings: AdminSettings;
  updateSettings: (settings: Partial<AdminSettings>) => void;
  loading: boolean;
}

const CypressSettings: React.FC<CypressSettingsProps> = ({
  settings,
  updateSettings,
  loading
}) => {
  const cypressSettings = settings.app?.cypressSettings ?? {
    cypressEnabled: false,
    cypressApiKey: ''
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Cypress Settings</h2>
          <Switch
            checked={cypressSettings.cypressEnabled}
            onCheckedChange={(checked: boolean) => {
              updateSettings({
                app: {
                  ...settings.app,
                  cypressSettings: {
                    ...cypressSettings,
                    cypressEnabled: checked
                  }
                }
              });
            }}
            disabled={loading}
          />
        </div>

        {cypressSettings.cypressEnabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cypressApiKey">API Key</Label>
              <Input
                id="cypressApiKey"
                type="password"
                value={cypressSettings.cypressApiKey}
                onChange={(e) => {
                  updateSettings({
                    app: {
                      ...settings.app,
                      cypressSettings: {
                        ...cypressSettings,
                        cypressApiKey: e.target.value
                      }
                    }
                  });
                }}
                disabled={loading}
                placeholder="Enter your Cypress API key"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CypressSettings;