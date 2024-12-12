import { MessageFormData } from './messageValidation';
import { DateTime } from 'luxon';

const DRAFT_STORAGE_KEY = 'message_scheduler_draft';
const HISTORY_STORAGE_KEY = 'message_scheduler_history';

export interface MessageHistory {
  id: string;
  content: string;
  scheduledFor: string;
  status: 'scheduled' | 'sent' | 'failed';
  createdAt: string;
}

export function saveDraft(formData: Partial<MessageFormData>): void {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
      ...formData,
      savedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}

export function loadDraft(): Partial<MessageFormData> | null {
  try {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!draft) return null;
    
    const parsedDraft = JSON.parse(draft);
    const savedAt = DateTime.fromISO(parsedDraft.savedAt);
    
    // Only return draft if it's less than 24 hours old
    if (DateTime.now().diff(savedAt, 'hours').hours < 24) {
      return parsedDraft;
    }
    
    // Clear old draft
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    return null;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}

export function saveToHistory(message: MessageHistory): void {
  try {
    const history = loadHistory();
    history.unshift(message);
    
    // Keep only last 100 messages in history
    if (history.length > 100) {
      history.pop();
    }
    
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export function loadHistory(): MessageHistory[] {
  try {
    const history = localStorage.getItem(HISTORY_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

// Undo/Redo functionality
const MAX_HISTORY = 10;
let undoStack: Partial<MessageFormData>[] = [];
let redoStack: Partial<MessageFormData>[] = [];

export function pushToHistory(state: Partial<MessageFormData>): void {
  undoStack.push({ ...state });
  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }
  redoStack = []; // Clear redo stack when new state is pushed
}

export function undo(): Partial<MessageFormData> | null {
  const previousState = undoStack.pop();
  if (!previousState) return null;
  
  redoStack.push(previousState);
  return previousState;
}

export function redo(): Partial<MessageFormData> | null {
  const nextState = redoStack.pop();
  if (!nextState) return null;
  
  undoStack.push(nextState);
  return nextState;
}

export function canUndo(): boolean {
  return undoStack.length > 0;
}

export function canRedo(): boolean {
  return redoStack.length > 0;
}

export function clearUndoRedo(): void {
  undoStack = [];
  redoStack = [];
}
