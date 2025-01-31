import React, { memo } from 'react';
import { Edit, Trash2, Mail, MessageSquare, Bell } from 'lucide-react';
import type { NotificationTemplate } from '@types/notifications';
import { getTemplateIcon } from './utils/templateUtils';
import { TEST_IDS } from './constants/templateConstants';
import { usePermissions } from '@hooks/usePermissions';
import { Card, CardContent, CardHeader } from '@components/molecules/card';
import { Button } from '@components/atoms/button';
import { Badge } from '@components/atoms/badge';
import { Skeleton } from '@components/atoms/skeleton';
import { Toast } from '@components/molecules/toast';
import { toast } from 'sonner';

interface TemplateItemProps {
  template: NotificationTemplate;
  onEdit: (template: NotificationTemplate) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  isLoading?: boolean;
}

const TemplateTypeIcons = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
};

const TemplateItem: React.FC<TemplateItemProps> = ({
  template,
  onEdit,
  onDelete,
  onSelect,
  isSelected,
  isLoading = false
}) => {
  const { canEdit, canDelete } = usePermissions();
  const Icon = TemplateTypeIcons[template.type] || MessageSquare;
  const formattedDate = new Date(template.lastModified).toLocaleDateString();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onDelete(template.id);
      toast.success('Template deleted successfully');
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(template);
  };

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      data-testid={TEST_IDS.TEMPLATE_ITEM}
      className={`w-full transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect?.(template.id)}
      role="listitem"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onSelect?.(template.id)}
      aria-selected={isSelected}
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <div className="p-2 bg-gray-100 rounded-full">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{template.name}</h3>
            <div className="flex items-center gap-2">
              {canEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEdit}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500">{template.description}</p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {template.type.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {template.category}
            </Badge>
          </div>
          <span className="text-xs text-gray-500">
            Last modified: {formattedDate}
          </span>
        </div>
        {template.variables?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {template.variables.map((variable) => (
              <Badge
                key={variable}
                variant="secondary"
                className="text-xs"
              >
                {variable}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(TemplateItem);
