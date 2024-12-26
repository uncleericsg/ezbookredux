import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Plus, Trash2, Loader2, GripVertical, Search, Bell, ToggleLeft, ToggleRight, Link } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { validatePushTemplate } from '../../services/notifications';

import type { PushTemplate } from '../../types/notifications';

type DragEndResult = {
  destination?: {
    index: number;
  };
  source: {
    index: number;
  };
};

const PushManager: React.FC = () => {
  const [templates, setTemplates] = useState<PushTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'manual' | 'scheduled' | 'event'>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleDragEnd = useCallback((result: DragEndResult) => {
    if (!result.destination) return;
    
    try {
      const items = Array.from(templates);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const updatedItems = items.map((item, index) => ({
        ...item,
        order: index + 1
      }));

      setTemplates(updatedItems);
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Failed to reorder templates');
    }
  }, [templates]);

  const createTemplate = () => {
    try {
      setError(null);
      setLoading(true);
      
      const newTemplate: PushTemplate = {
        id: Date.now().toString(),
        title: 'New Push Template',
        content: 'Hello {first_name}! ',
        triggerType: 'manual',
        status: 'inactive',
        lastModified: new Date().toISOString(),
        order: templates.length + 1,
        targeting: {
          userGroups: [],
          regions: [],
          languages: []
        },
        schedule: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      if (!validatePushTemplate(newTemplate)) {
        throw new Error('Invalid template configuration');
      }
      
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Push template created successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create template');
      toast.error('Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'toggle') => {
    if (selectedItems.size === 0) return;

    try {
      setLoading(true);
      if (action === 'delete') {
        setTemplates(prev => prev.filter(t => !selectedItems.has(t.id)));
        toast.success('Selected templates deleted');
      } else {
        setTemplates(prev => prev.map(t => 
          selectedItems.has(t.id) 
            ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' }
            : t
        ));
        toast.success('Status updated for selected templates');
      }
      setSelectedItems(new Set());
    } catch (error) {
      toast.error('Failed to perform bulk action');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates
    .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(t => selectedStatus === 'all' || t.status === selectedStatus)
    .filter(t => selectedType === 'all' || t.triggerType === selectedType);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
          />
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
          >
            <option value="all">All Types</option>
            <option value="manual">Manual</option>
            <option value="scheduled">Scheduled</option>
            <option value="event">Event-based</option>
          </select>

          <button
            onClick={createTemplate}
            className="btn-icon bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
            title="Add Push Template"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <span className="text-sm text-gray-400">
            {selectedItems.size} template{selectedItems.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleBulkAction('toggle')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Toggle Status
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="btn bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              Delete Selected
            </button>
          </div>
        </motion.div>
      )}

      {/* Templates List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="templates">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {filteredTemplates.map((template, index) => (
                <Draggable
                  key={template.id}
                  draggableId={template.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={classNames(
                        'bg-gray-800 rounded-lg p-4 border transition-colors',
                        snapshot.isDragging ? 'border-blue-500' : 'border-gray-700'
                      )}
                    >
                      <div className="flex items-start space-x-4">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>

                        <input
                          type="checkbox"
                          checked={selectedItems.has(template.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedItems);
                            if (e.target.checked) {
                              newSelected.add(template.id);
                            } else {
                              newSelected.delete(template.id);
                            }
                            setSelectedItems(newSelected);
                          }}
                          className="mt-1 h-4 w-4 rounded border-gray-600 text-blue-500"
                        />

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={template.title}
                              onChange={(e) => {
                                setTemplates(prev => prev.map(t =>
                                  t.id === template.id ? { ...t, title: e.target.value } : t
                                ));
                              }}
                              className="bg-transparent border-none focus:ring-0 text-lg font-medium"
                            />
                            <div className="flex items-center space-x-4">
                              <span className={classNames(
                                'px-2 py-1 rounded-full text-sm',
                                template.status === 'active' 
                                  ? 'bg-green-500/10 text-green-400 flex items-center space-x-1'
                                  : 'bg-gray-500/10 text-gray-400 flex items-center space-x-1'
                              )}>
                                {template.status === 'active' ? (
                                  <ToggleRight className="h-4 w-4" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4" />
                                )}
                                {template.status}
                              </span>
                              <button
                                onClick={() => {
                                  setTemplates(prev => prev.filter(t => t.id !== template.id));
                                  toast.success('Template deleted');
                                }}
                                className="btn-icon text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <textarea
                            value={template.content}
                            onChange={(e) => {
                              setTemplates(prev => prev.map(t =>
                                t.id === template.id ? { ...t, content: e.target.value } : t
                              ));
                            }}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-24"
                            placeholder="Push notification content..."
                          />

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              <div className="flex items-center space-x-2">
                                <Link className="h-4 w-4 text-blue-400" />
                                <span>Action URL (Optional)</span>
                              </div>
                            </label>
                            <input
                              type="url"
                              value={template.url || ''}
                              onChange={(e) => {
                                setTemplates(prev => prev.map(t =>
                                  t.id === template.id ? { ...t, url: e.target.value } : t
                                ));
                              }}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                              placeholder="https://example.com/action"
                            />
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center space-x-4">
                              <select
                                value={template.triggerType}
                                onChange={(e) => {
                                  setTemplates(prev => prev.map(t =>
                                    t.id === template.id ? { ...t, triggerType: e.target.value as any } : t
                                  ));
                                }}
                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1"
                              >
                                <option value="manual">Manual</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="event">Event-based</option>
                              </select>

                              {template.triggerType === 'scheduled' && (
                                <input
                                  type="number"
                                  value={template.dueDays || ''}
                                  onChange={(e) => {
                                    setTemplates(prev => prev.map(t =>
                                      t.id === template.id ? { ...t, dueDays: parseInt(e.target.value) } : t
                                    ));
                                  }}
                                  className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1"
                                  placeholder="Days"
                                />
                              )}
                            </div>

                            <span>
                              Last modified: {new Date(template.lastModified).toLocaleDateString()}
                            </span>
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

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No push notification templates found</p>
        </div>
      )}
    </div>
  );
};

export default PushManager;