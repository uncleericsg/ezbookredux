/*
 * @ai-protection - DO NOT MODIFY THIS FILE
 * This is a stable version of the issue selection component that:
 * 1. Displays available service issues
 * 2. Handles issue selection logic
 * 3. Manages issue categorization
 * 4. Provides issue descriptions
 * 
 * Critical Features:
 * - Dynamic issue loading
 * - Category-based filtering
 * - Interactive selection UI
 * - Issue validation
 * - Accessibility support
 * 
 * Integration Points:
 * - Booking flow state management
 * - Issue catalog service
 * - Navigation service
 * - Analytics tracking
 * 
 * @ai-visual-protection: The issue selection UI must maintain consistent styling
 * @ai-flow-protection: The selection and validation flow must not be modified
 * @ai-state-protection: The issue state management is optimized
 * 
 * Any modifications to this component could affect:
 * 1. Issue categorization
 * 2. Service recommendations
 * 3. Booking flow progression
 * 4. User selection experience
 * 
 * If changes are needed:
 * 1. Verify issue categories
 * 2. Test selection logic
 * 3. Validate accessibility
 * 4. Update documentation
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ThumbsUp, 
  Home, 
  LogOut, 
  Thermometer, 
  Droplet, 
  Wind, 
  Volume2, 
  Droplets,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { IssueCard } from '@components/booking/components/IssueCard';
import { useScrollToTop } from '@hooks/useScrollToTop';
import { Spinner } from '@components/ui/spinner';
import styles from './IssueSelection.module.css';

interface Issue {
  id: IssueId;
  title: string;
  description: string;
  icon: JSX.Element;
}

type IssueId = 
  | 'all-good'
  | 'just-moved'
  | 'moving-out'
  | 'not-cooling'
  | 'water-leaking'
  | 'funky-smell'
  | 'weird-noises'
  | 'sweating-trunking'
  | 'other';

interface IssueSelectionState {
  selectedIssues: IssueId[];
  otherIssue: string;
  validationError?: string;
  isCompactView: boolean;
}

interface IssueSelectionProps {
  onContinue: (issues: string[], otherIssue?: string) => void;
  error?: string;
}

const MAX_OTHER_ISSUE_LENGTH = 200;

const COMMON_ISSUES: Issue[] = [
  {
    id: 'all-good',
    title: 'No Problem! My AC is All Good!',
    description: 'Regular maintenance for optimal AC performance',
    icon: <ThumbsUp className="w-5 h-5 text-green-500" />
  },
  {
    id: 'not-cooling',
    title: 'Need Help! Not Cooling!',
    description: 'AC system running normally but not producing cooling effectively',
    icon: <Thermometer className="w-5 h-5 text-red-500" />
  },
  {
    id: 'water-leaking',
    title: 'Oh Yes! Water Leaking!',
    description: 'Water visibly dripping or leaking from AC unit',
    icon: <Droplet className="w-5 h-5 text-blue-500" />
  },
  {
    id: 'funky-smell',
    title: 'Having Funky Smell...',
    description: 'Persistent unpleasant odors emitting from AC system',
    icon: <Wind className="w-5 h-5 text-purple-500" />
  },
  {
    id: 'weird-noises',
    title: 'Some Weird Noises',
    description: 'Unusual and concerning operational sounds from AC unit',
    icon: <Volume2 className="w-5 h-5 text-yellow-500" />
  },
  {
    id: 'sweating-trunking',
    title: 'Sweating on Trunking',
    description: 'Condensation or water marks on AC trunking',
    icon: <Droplets className="w-5 h-5 text-cyan-500" />
  },
  {
    id: 'just-moved',
    title: 'Just Moved In!',
    description: 'Complete inspection of all AC units in your new place',
    icon: <Home className="w-5 h-5 text-blue-500" />
  },
  {
    id: 'moving-out',
    title: 'We are Moving Out!',
    description: 'Handover service to ensure AC is in proper condition',
    icon: <LogOut className="w-5 h-5 text-orange-500" />
  },
  {
    id: 'other',
    title: 'Others',
    description: 'Tell us about other issues in the notes below',
    icon: <HelpCircle className="w-5 h-5 text-gray-500" />
  }
];

const IssueSelection: React.FC<IssueSelectionProps> = ({ onContinue, error: propError }) => {
  const [state, setState] = useState<IssueSelectionState>({
    selectedIssues: [],
    otherIssue: '',
    validationError: undefined,
    isCompactView: false
  });
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [fadeOutItems, setFadeOutItems] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollToTop = useScrollToTop([]);

  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;
    let compactTimeout: NodeJS.Timeout;
    
    if (state.selectedIssues.length > 0) {
      // Start fade out animation
      fadeTimeout = setTimeout(() => {
        setFadeOutItems(true);
        
        // After fade out, switch to compact view
        compactTimeout = setTimeout(() => {
          setState(prev => ({ ...prev, isCompactView: true }));
          setFadeOutItems(false);
        }, 500); // Wait for fade out animation to complete
      }, 2000);
    } else {
      setFadeOutItems(false);
      setState(prev => ({ ...prev, isCompactView: false }));
    }

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(compactTimeout);
    };
  }, [state.selectedIssues]);

  const handleIssueToggle = useCallback((issueId: IssueId) => {
    setState(prevState => {
      const { selectedIssues } = prevState;
      let newSelection = [...selectedIssues];
      
      if (issueId === 'all-good') {
        const isSelected = selectedIssues.includes(issueId);
        setFadeOutItems(false);
        return {
          ...prevState,
          selectedIssues: isSelected ? [] : [issueId],
          validationError: undefined,
          isCompactView: false
        };
      }
      
      newSelection = newSelection.filter(i => i !== 'all-good');
      
      if (selectedIssues.includes(issueId)) {
        newSelection = newSelection.filter(i => i !== issueId);
      } else {
        newSelection.push(issueId);
      }
      
      if (issueId === 'other') {
        setShowOtherInput(newSelection.includes('other'));
        if (!newSelection.includes('other')) {
          return {
            ...prevState,
            selectedIssues: newSelection,
            otherIssue: '',
            validationError: undefined,
            isCompactView: false
          };
        }
      }
      
      // Reset compact view when deselecting all issues
      if (newSelection.length === 0) {
        setFadeOutItems(false);
        return {
          ...prevState,
          selectedIssues: newSelection,
          validationError: undefined,
          isCompactView: false
        };
      }
      
      return {
        ...prevState,
        selectedIssues: newSelection,
        validationError: undefined
      };
    });
  }, []);

  const handleOtherIssueChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setState(prev => ({
      ...prev,
      otherIssue: value.slice(0, MAX_OTHER_ISSUE_LENGTH),
      validationError: undefined
    }));
  }, []);

  const handleContinue = useCallback(() => {
    if (state.selectedIssues.length === 0 && !state.otherIssue) {
      setState(prev => ({
        ...prev,
        validationError: 'Please select at least one issue or describe your problem'
      }));
      return;
    }
    setIsLoading(true);
    scrollToTop();
    const issues = state.selectedIssues.map(id => 
      COMMON_ISSUES.find(issue => issue.id === id)?.title || ''
    ).filter(Boolean);
    onContinue(issues, state.otherIssue);
  }, [state.selectedIssues, state.otherIssue, onContinue, scrollToTop]);

  const remainingChars = MAX_OTHER_ISSUE_LENGTH - state.otherIssue.length;

  const renderIssueCard = useCallback((issue: Issue) => (
    <motion.div
      key={issue.id}
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: fadeOutItems ? (state.selectedIssues.includes(issue.id) ? 1 : 0) : 1,
        scale: fadeOutItems ? (state.selectedIssues.includes(issue.id) ? 1 : 0.95) : 1,
        height: state.isCompactView ? (state.selectedIssues.includes(issue.id) ? 'auto' : 0) : 'auto'
      }}
      transition={{ duration: 0.5 }}
      style={{
        overflow: 'hidden',
        display: state.isCompactView && !state.selectedIssues.includes(issue.id) ? 'none' : 'block'
      }}
      role="checkbox"
      aria-checked={state.selectedIssues.includes(issue.id)}
      tabIndex={0}
      onKeyPress={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleIssueToggle(issue.id);
        }
      }}
    >
      <IssueCard
        title={issue.title}
        description={issue.description}
        icon={issue.icon}
        selected={state.selectedIssues.includes(issue.id)}
        onClick={() => handleIssueToggle(issue.id)}
        aria-label={`${issue.title} - ${issue.description}`}
      />
    </motion.div>
  ), [state.isCompactView, state.selectedIssues, handleIssueToggle, fadeOutItems]);

  const memoizedIssueCards = useMemo(() => 
    COMMON_ISSUES.map(issue => renderIssueCard(issue)),
    [renderIssueCard]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
      role="region"
      aria-label="AC Issue Selection"
    >
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div>
          <h2 className={styles.header}>
            {state.isCompactView ? 'Selected Issues' : 'Select Your AC Issue'}
          </h2>
          <p className={styles.description}>
            {state.isCompactView 
              ? 'Your selected issues are shown below. Click an issue to deselect it.'
              : 'Choose the issues you are experiencing with your air conditioner'
            }
          </p>
        </div>
      )}
      <div 
        className={`${state.isCompactView ? styles.issueGridCompact : styles.issueGrid}`}
        role="group" 
        aria-label="Available AC Issues"
      >
        {memoizedIssueCards}
      </div>

      {(propError || state.validationError) && (
        <div className={styles.error} role="alert">
          <AlertTriangle size={16} />
          <span className={styles.errorText}>{propError || state.validationError}</span>
        </div>
      )}

      <div className={styles.textareaContainer}>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: showOtherInput || state.selectedIssues.length > 0 ? 1 : 0,
            height: showOtherInput || state.selectedIssues.length > 0 ? 'auto' : 0
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <label htmlFor="otherIssue" className={styles.textareaLabel}>
            Additional Notes (Optional)
          </label>
          <textarea
            id="otherIssue"
            value={state.otherIssue}
            onChange={handleOtherIssueChange}
            placeholder="Please provide any additional details about your AC issues..."
            className={styles.textarea}
            rows={3}
            maxLength={MAX_OTHER_ISSUE_LENGTH}
            aria-label="Additional notes about your AC issues"
            aria-describedby="charCount"
          />
          <div id="charCount" className={styles.remainingChars}>
            {remainingChars} characters remaining
          </div>
        </motion.div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={handleContinue}
          disabled={state.selectedIssues.length === 0 && !state.otherIssue}
          className={`${styles.button} ${
            state.selectedIssues.length > 0 || state.otherIssue
              ? styles.buttonEnabled
              : styles.buttonDisabled
          }`}
          aria-label="Continue to next step"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(IssueSelection);