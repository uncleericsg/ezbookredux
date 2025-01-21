'use client';

import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { Save, Plus, Trash2, Loader2, GripVertical, Link, Image, ChevronRight, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useSettingsForm } from '@/hooks/useSettingsForm';
import { 
  HomepageSettings, 
  ServiceCategory, 
  CategoryWithChildren,
  CardSettings
} from '@shared/types/homepage-settings';
import { defaultAppointmentTypes } from '@shared/types/appointment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategoryMappingModal from './CategoryMappingModal';

// Default settings
const defaultSettings: HomepageSettings = {
  cards: [
    {
      id: 'amc-card',
      title: 'Annual Maintenance Contract',
      description: 'Get peace of mind with our comprehensive AMC package',
      ctaText: 'Learn More',
      ctaLink: '/amc-package-signup',
      order: 1,
      visible: true,
      visibilityType: 'all'
    }
  ],
  categories: [
    {
      id: 'regular',
      name: 'Regular Maintenance',
      description: 'Standard air conditioning service and maintenance',
      type: 'maintenance',
      price: 80,
      icon: 'AirVent',
      visible: true,
      order: 1,
      appointmentTypeId: 'regular-service'
    },
    {
      id: 'repair',
      name: 'Repair Service',
      description: 'Diagnostic and repair for AC issues',
      type: 'repair',
      price: 120,
      icon: 'Wrench',
      visible: true,
      order: 2,
      appointmentTypeId: 'repair-service'
    },
    {
      id: 'amc',
      name: 'AMC Service Visit',
      description: 'Scheduled maintenance under AMC package',
      type: 'amc',
      price: null,
      icon: 'ShieldCheck',
      visible: true,
      order: 0,
      appointmentTypeId: 'amc-service'
    }
  ]
};

const fetchHomepageSettings = async (): Promise<HomepageSettings> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(defaultSettings);
    }, 500);
  });
};

const saveHomepageSettings = async (settings: HomepageSettings): Promise<void> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving settings:', settings);
      resolve();
    }, 500);
  });
};

const HomepageManager: React.FC = () => {
  const {
    settings,
    loading,
    updateSettings,
    handleSave
  } = useSettingsForm<HomepageSettings>(
    defaultSettings,
    saveHomepageSettings,
    fetchHomepageSettings
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [mappingCategory, setMappingCategory] = useState<ServiceCategory | null>(null);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const addCategory = (parentId?: string) => {
    const newCategory: ServiceCategory = {
      id: `category-${Date.now()}`,
      name: 'New Category',
      description: '',
      type: 'maintenance',
      price: null,
      parentId,
      visible: true,
      order: settings.categories.filter((c: ServiceCategory) => c.parentId === parentId).length + 1
    };

    updateSettings({
      categories: [...settings.categories, newCategory]
    });
  };

  const handleCategoryDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    // Create a copy of categories and sort by order
    const categories = [...settings.categories].sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : Infinity;
      const orderB = typeof b.order === 'number' ? b.order : Infinity;
      return orderA - orderB;
    });

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const [movedCategory] = categories.splice(sourceIndex, 1);
    categories.splice(destinationIndex, 0, movedCategory);
    
    // Update order for all categories to ensure consistent positioning
    const updatedCategories = categories.map((category, index) => ({
      ...category,
      order: index + 1
    }));
    
    updateSettings({ categories: updatedCategories });
    handleSave().catch(() => {
      toast.error('Failed to save category order');
    });
  };

  const buildCategoryHierarchy = (categories: ServiceCategory[]): CategoryWithChildren[] => {
    // Create a copy of categories and sort by order
    const sortedCategories = [...categories].sort((a, b) => {
      // Handle undefined orders by treating them as highest value
      const orderA = typeof a.order === 'number' ? a.order : Infinity;
      const orderB = typeof b.order === 'number' ? b.order : Infinity;
      return orderA - orderB;
    });
    
    const categoryMap = new Map<string, CategoryWithChildren>();
    const roots: CategoryWithChildren[] = [];

    // Create category objects
    sortedCategories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build hierarchy
    sortedCategories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(categoryWithChildren);
        }
      } else {
        roots.push(categoryWithChildren);
      }
    });

    return roots;
  };

  const renderCategory = (
    category: CategoryWithChildren, 
    level = 0, 
    dragHandleProps: DraggableProvided['dragHandleProps']
  ) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="space-y-2">
        <div 
          className={`
            flex items-center space-x-2 p-2 rounded-lg transition-colors
            hover:bg-gray-700/50
          `}
          style={{ marginLeft: `${level * 1.5}rem` }}
        >
          <div {...dragHandleProps} className="flex items-center flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={category.name || ''}
                onChange={(e) => {
                  const updatedCategories = settings.categories.map((cat: ServiceCategory) =>
                    cat.id === category.id ? { ...cat, name: e.target.value } : cat
                  );
                  updateSettings({ categories: updatedCategories });
                }}
                className="bg-transparent border-none focus:ring-0 flex-1"
              />
              <div className="flex items-center space-x-2">
                <Select
                  value={category.visibilityType || 'all'}
                  onValueChange={(value: 'all' | 'amc') => {
                    const updatedCategories = settings.categories.map((cat: ServiceCategory) =>
                      cat.id === category.id ? { ...cat, visibilityType: value } : cat
                    );
                    updateSettings({ categories: updatedCategories });
                  }}
                >
                  <SelectTrigger className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="amc">AMC Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => addCategory(category.id)}
              className="p-1 hover:bg-gray-700 rounded"
              title="Add sub-category"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setMappingCategory(category)}
              className="p-1 hover:bg-gray-700 rounded"
              title="Map to appointment type"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-4">
            {category.children!.map(child => renderCategory(child, level + 1, dragHandleProps))}
          </div>
        )}
      </div>
    );
  };

  const categoryHierarchy = buildCategoryHierarchy(settings.categories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSave();
      toast.success('Homepage settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleAppointmentTypeMapping = (appointmentTypeId: string) => {
    if (!mappingCategory) return;

    const updatedCategories = settings.categories.map((cat: ServiceCategory) =>
      cat.id === mappingCategory.id ? { ...cat, appointmentTypeId } : cat
    );
    updateSettings({ categories: updatedCategories });
    handleSave().catch(() => {
      toast.error('Failed to save appointment type mapping');
    });
    setMappingCategory(null);
    toast.success('Category mapping updated');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Service Categories */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Service Categories</h2>
          <Button
            onClick={() => addCategory()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            title="Add Category"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <DragDropContext onDragEnd={handleCategoryDragEnd}>
          <Droppable droppableId="categories">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {categoryHierarchy.map((category, index) => (
                  <Draggable
                    key={category.id}
                    draggableId={category.id}
                    index={index}
                  >
                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-gray-800 rounded-lg border ${
                          snapshot.isDragging ? 'border-blue-500' : 'border-gray-700'
                        }`}
                      >
                        {renderCategory(category, 0, provided.dragHandleProps)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Homepage Cards */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Homepage Cards</h2>
          <Button
            onClick={() => {
              const newCard: CardSettings = {
                id: `card-${Date.now()}`,
                title: 'New Card',
                description: '',
                ctaText: 'Learn More',
                ctaLink: '/',
                order: settings.cards.length + 1,
                visible: true,
                visibilityType: 'all'
              };

              updateSettings({
                cards: [...settings.cards, newCard]
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            title="Add Card"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <DragDropContext onDragEnd={(result: DropResult) => {
          if (!result.destination) return;
          
          const items = Array.from(settings.cards);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          
          const updatedItems = items.map((item, index) => ({
            ...item,
            order: index + 1
          }));
          
          updateSettings({ cards: updatedItems });
        }}>
          <Droppable droppableId="cards">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {settings.cards.map((card: CardSettings, index: number) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                      >
                        <div className="flex items-start space-x-4">
                          <div {...provided.dragHandleProps} className="mt-2">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <Input
                              type="text"
                              value={card.title}
                              onChange={(e) => {
                                const updatedCards = settings.cards.map((c: CardSettings) =>
                                  c.id === card.id ? { ...c, title: e.target.value } : c
                                );
                                updateSettings({ cards: updatedCards });
                              }}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                              placeholder="Card Title"
                            />

                            <textarea
                              value={card.description}
                              onChange={(e) => {
                                const updatedCards = settings.cards.map((c: CardSettings) =>
                                  c.id === card.id ? { ...c, description: e.target.value } : c
                                );
                                updateSettings({ cards: updatedCards });
                              }}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-24"
                              placeholder="Card Description"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="block text-sm font-medium text-gray-300 mb-1">
                                  <div className="flex items-center space-x-2">
                                    <Link className="h-4 w-4 text-blue-400" />
                                    <span>CTA Text</span>
                                  </div>
                                </Label>
                                <Input
                                  type="text"
                                  value={card.ctaText}
                                  onChange={(e) => {
                                    const updatedCards = settings.cards.map((c: CardSettings) =>
                                      c.id === card.id ? { ...c, ctaText: e.target.value } : c
                                    );
                                    updateSettings({ cards: updatedCards });
                                  }}
                                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                                  placeholder="Call to Action Text"
                                />
                              </div>

                              <div>
                                <Label className="block text-sm font-medium text-gray-300 mb-1">
                                  <div className="flex items-center space-x-2">
                                    <Link className="h-4 w-4 text-blue-400" />
                                    <span>CTA Link</span>
                                  </div>
                                </Label>
                                <Input
                                  type="text"
                                  value={card.ctaLink}
                                  onChange={(e) => {
                                    const updatedCards = settings.cards.map((c: CardSettings) =>
                                      c.id === card.id ? { ...c, ctaLink: e.target.value } : c
                                    );
                                    updateSettings({ cards: updatedCards });
                                  }}
                                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                                  placeholder="/page-url"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="block text-sm font-medium text-gray-300 mb-1">
                                <div className="flex items-center space-x-2">
                                  <Image className="h-4 w-4 text-blue-400" />
                                  <span>Image URL</span>
                                </div>
                              </Label>
                              <Input
                                type="text"
                                value={card.imageUrl || ''}
                                onChange={(e) => {
                                  const updatedCards = settings.cards.map((c: CardSettings) =>
                                    c.id === card.id ? { ...c, imageUrl: e.target.value } : c
                                  );
                                  updateSettings({ cards: updatedCards });
                                }}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>

                            <div>
                              <Label className="block text-sm font-medium text-gray-300 mb-1">
                                Appointment Type
                              </Label>
                              <Select
                                value={card.appointmentTypeId || ''}
                                onValueChange={(value: string) => {
                                  const updatedCards = settings.cards.map((c: CardSettings) =>
                                    c.id === card.id ? { ...c, appointmentTypeId: value } : c
                                  );
                                  updateSettings({ cards: updatedCards });
                                }}
                              >
                                <SelectTrigger className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2">
                                  <SelectValue placeholder="Select appointment type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">None</SelectItem>
                                  {defaultAppointmentTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id}>
                                      {type.name} ({type.duration} mins)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`visible-${card.id}`}
                                  checked={card.visible}
                                  onChange={(e) => {
                                    const updatedCards = settings.cards.map((c: CardSettings) =>
                                      c.id === card.id ? { ...c, visible: e.target.checked } : c
                                    );
                                    updateSettings({ cards: updatedCards });
                                  }}
                                  className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                                />
                                <label htmlFor={`visible-${card.id}`} className="ml-2 text-sm text-gray-300">
                                  Visible
                                </label>
                              </div>

                              <Button
                                onClick={() => {
                                  const updatedCards = settings.cards.filter((c: CardSettings) => c.id !== card.id);
                                  updateSettings({ cards: updatedCards });
                                }}
                                className="text-red-400 hover:text-red-500"
                                title="Delete card"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

      {mappingCategory && (
        <CategoryMappingModal
          category={mappingCategory}
          appointmentTypes={defaultAppointmentTypes}
          onClose={() => setMappingCategory(null)}
          onSave={handleAppointmentTypeMapping}
        />
      )}
    </form>
  );
};

export default HomepageManager;
