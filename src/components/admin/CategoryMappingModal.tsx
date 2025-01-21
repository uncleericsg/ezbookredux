import { X } from 'lucide-react';
import * as React from 'react';

import { CategoryMappingModalProps } from '@shared/types/homepage-settings';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CategoryMappingModal: React.FC<CategoryMappingModalProps> = ({
  category,
  appointmentTypes,
  onClose,
  onSave
}) => {
  const [selectedType, setSelectedType] = React.useState(category.appointmentTypeId || '');

  const handleSave = () => {
    onSave(selectedType);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Map Category to Appointment Type</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="rounded-md border border-gray-700 bg-gray-800 px-4 py-3">
              {category.name}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Appointment Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {appointmentTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.duration} mins)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Mapping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryMappingModal;
