import React from 'react';
import { Card } from '@ui/card';
import { Input } from '@ui/input';
import { Label } from '@ui/label';
import { Switch } from '@ui/switch';
import type { AdminSettings } from '@shared/types/settings';
import type { CypressSettings as CypressSettingsType } from '@shared/types/appSettings';

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
  const cypressSettings: CypressSettingsType = settings.app?.cypressSettings ?? {
    cypressEnabled: false,
    cypressApiKey: ''
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Cypress Settings</h2>
          <Switch
            checked={cypressSettings.cypressEnabled ?? false}
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
                value={cypressSettings.cypressApiKey ?? ''}
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
