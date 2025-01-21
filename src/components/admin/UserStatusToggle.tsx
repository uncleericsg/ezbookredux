import { Switch } from '@/components/ui/switch';
import { UserStatusToggleProps } from '@shared/types/user';
import { useState } from 'react';
import { toast } from 'sonner';

const UserStatusToggle: React.FC<UserStatusToggleProps> = ({
  userId,
  isActive,
  onToggle
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    try {
      setLoading(true);
      await onToggle(userId, checked);
      toast.success(`User ${checked ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${isActive ? 'deactivate' : 'activate'} user`);
      console.error('Toggle error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      disabled={loading}
      className="data-[state=checked]:bg-green-500"
    />
  );
};

export default UserStatusToggle;
