'use client';

import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { Button } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Label } from '@components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';

export interface BillingSettingsData;

export interface BillingSettingsProps;

;
  invoiceSettings: {
    companyName: string;
    companyAddress: string;
    companyEmail: string;
    companyPhone: string;
    vatNumber: string;
    prefix: string;
    footer: string;
  };
  notifications: {
    paymentSuccess: boolean;
    paymentFailed: boolean;
    invoiceGenerated: boolean;
    reminderEnabled: boolean;
    reminderDays: number;
  };
}

interface BillingSettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  settings: BillingSettingsData;
  onSave: (settings: BillingSettingsData) => Promise<void>;
  loading?: boolean;
}

const BillingSettings = ({
  settings: initialSettings,
  onSave,
  loading = false,
  className,
  ...props
}: BillingSettingsProps) => {
  const [settings, setSettings] = useState<BillingSettingsData>(initialSettings);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSave = async () => {
    try {
      await onSave(settings);
      toast.success('Billing settings saved successfully');
    } catch (error) {
      toast.error('Failed to save billing settings');
      console.error('Error saving billing settings:', error);
    }
  };

  const updateSettings = <K extends keyof BillingSettingsData>(key: K, value: BillingSettingsData[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updatePaymentMethods = (key: keyof BillingSettingsData['paymentMethods'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: { ...prev.paymentMethods, [key]: value },
    }));
  };

  const updateInvoiceSettings = (key: keyof BillingSettingsData['invoiceSettings'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      invoiceSettings: { ...prev.invoiceSettings, [key]: value },
    }));
  };

  const updateNotifications = (
    key: keyof BillingSettingsData['notifications'],
    value: boolean | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Billing Settings</span>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => updateSettings('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => updateSettings('taxRate', parseFloat(e.target.value))}
                  min={0}
                  max={100}
                  step={0.1}
                />
              </div>

              <div className="space-y-4">
                <Label>Payment Methods</Label>
                <div className="flex items-center justify-between">
                  <Label>Credit Card</Label>
                  <input
                    type="checkbox"
                    checked={settings.paymentMethods.creditCard}
                    onChange={(e) => updatePaymentMethods('creditCard', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>PayNow</Label>
                  <input
                    type="checkbox"
                    checked={settings.paymentMethods.payNow}
                    onChange={(e) => updatePaymentMethods('payNow', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Bank Transfer</Label>
                  <input
                    type="checkbox"
                    checked={settings.paymentMethods.bankTransfer}
                    onChange={(e) => updatePaymentMethods('bankTransfer', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stripe" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Stripe</Label>
                <input
                  type="checkbox"
                  checked={settings.stripeEnabled}
                  onChange={(e) => updateSettings('stripeEnabled', e.target.checked)}
                />
              </div>

              <div>
                <Label>Publishable Key</Label>
                <Input
                  type="password"
                  value={settings.stripePublishableKey}
                  onChange={(e) => updateSettings('stripePublishableKey', e.target.value)}
                  placeholder="pk_..."
                />
              </div>

              <div>
                <Label>Secret Key</Label>
                <Input
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={(e) => updateSettings('stripeSecretKey', e.target.value)}
                  placeholder="sk_..."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoice" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={settings.invoiceSettings.companyName}
                  onChange={(e) => updateInvoiceSettings('companyName', e.target.value)}
                />
              </div>

              <div>
                <Label>Company Address</Label>
                <Input
                  value={settings.invoiceSettings.companyAddress}
                  onChange={(e) => updateInvoiceSettings('companyAddress', e.target.value)}
                />
              </div>

              <div>
                <Label>Company Email</Label>
                <Input
                  type="email"
                  value={settings.invoiceSettings.companyEmail}
                  onChange={(e) => updateInvoiceSettings('companyEmail', e.target.value)}
                />
              </div>

              <div>
                <Label>Company Phone</Label>
                <Input
                  value={settings.invoiceSettings.companyPhone}
                  onChange={(e) => updateInvoiceSettings('companyPhone', e.target.value)}
                />
              </div>

              <div>
                <Label>VAT Number</Label>
                <Input
                  value={settings.invoiceSettings.vatNumber}
                  onChange={(e) => updateInvoiceSettings('vatNumber', e.target.value)}
                />
              </div>

              <div>
                <Label>Invoice Number Prefix</Label>
                <Input
                  value={settings.invoiceSettings.prefix}
                  onChange={(e) => updateInvoiceSettings('prefix', e.target.value)}
                />
              </div>

              <div>
                <Label>Invoice Footer</Label>
                <Input
                  value={settings.invoiceSettings.footer}
                  onChange={(e) => updateInvoiceSettings('footer', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Payment Success</Label>
                <input
                  type="checkbox"
                  checked={settings.notifications.paymentSuccess}
                  onChange={(e) => updateNotifications('paymentSuccess', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Payment Failed</Label>
                <input
                  type="checkbox"
                  checked={settings.notifications.paymentFailed}
                  onChange={(e) => updateNotifications('paymentFailed', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Invoice Generated</Label>
                <input
                  type="checkbox"
                  checked={settings.notifications.invoiceGenerated}
                  onChange={(e) => updateNotifications('invoiceGenerated', e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Payment Reminder</Label>
                <input
                  type="checkbox"
                  checked={settings.notifications.reminderEnabled}
                  onChange={(e) => updateNotifications('reminderEnabled', e.target.checked)}
                />
              </div>

              {settings.notifications.reminderEnabled && (
                <div>
                  <Label>Reminder Days Before Due</Label>
                  <Input
                    type="number"
                    value={settings.notifications.reminderDays}
                    onChange={(e) => updateNotifications('reminderDays', parseInt(e.target.value))}
                    min={1}
                    max={30}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

BillingSettings.displayName = 'BillingSettings';

export type { BillingSettingsData };
export { BillingSettings };

undefined.displayName = 'undefined';