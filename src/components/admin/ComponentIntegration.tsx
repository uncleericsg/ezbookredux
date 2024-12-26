import { motion, AnimatePresence } from 'framer-motion';
import { Book, ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

const ComponentIntegration: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = [
    {
      title: '1. Component Architecture',
      content: `File Structure:
src/
  components/
    admin/
      settings/
        ComponentName/
          index.tsx
          types.ts
          hooks/
          utils/
          components/

Key Considerations:
- Each component should be self-contained with its own types, hooks, and utilities
- Follow existing naming conventions and file structure
- Maintain consistent styling with the admin dashboard theme`
    },
    {
      title: '2. State Management',
      content: `Integration Points:
- Use existing context providers (UserContext, etc.)
- Leverage shared hooks and utilities
- Maintain consistent state management patterns

Data Flow Example:
const [settings, setSettings] = useState<Settings>(defaultSettings);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);`
    },
    {
      title: '3. API Integration',
      content: `Error Handling:
- Use consistent error handling patterns
- Implement proper loading states
- Follow existing retry mechanisms

Development vs Production:
if (import.meta.env.DEV) {
  // Development mock data
} else {
  // Production API calls
}`
    },
    {
      title: '4. UI/UX Guidelines',
      content: `Styling:
- Use existing Tailwind CSS classes
- Maintain dark mode compatibility
- Follow responsive design patterns

Component Structure:
interface ComponentProps {
  settings: Settings;
  loading?: boolean;
  onSave: () => Promise<void>;
}`
    },
    {
      title: '5. Testing Considerations',
      content: `Test Coverage:
- Maintain existing Cypress test patterns
- Include unit tests for utilities
- Add integration tests for API interactions`
    },
    {
      title: '6. Performance Optimization',
      content: `Best Practices:
- Implement proper memoization
- Use lazy loading for sub-components
- Follow existing code-splitting patterns`
    },
    {
      title: '7. Security Considerations',
      content: `Data Handling:
- Validate all user inputs
- Sanitize data before display
- Follow existing security patterns`
    },
    {
      title: '8. Documentation Requirements',
      content: `Component Documentation:
/**
 * @component ComponentName
 * @description Brief description of component purpose
 * @example
 * <ComponentName
 *   settings={settings}
 *   onSave={handleSave}
 * />
 */`
    },
    {
      title: '9. Merge Process',
      content: `Pre-merge Checklist:
1. Component follows project structure
2. All tests pass
3. No console errors/warnings
4. Proper error handling
5. Responsive design implemented
6. Documentation complete

Integration Steps:
1. Create feature branch
2. Implement component
3. Add tests
4. Update documentation
5. Create pull request
6. Address review feedback
7. Merge to main branch`
    },
    {
      title: '10. Common Pitfalls',
      content: `Avoid:
- Breaking existing functionality
- Inconsistent styling
- Duplicate state management
- Poor error handling
- Missing loading states
- Incomplete documentation

Best Practices:
- Follow existing patterns
- Maintain type safety
- Use proper error boundaries
- Implement proper loading states
- Document all props and functions`
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Book className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-semibold">Component Integration</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <span>Read Me</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            {sections.map((section, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="text-lg font-medium mb-3 text-blue-400">{section.title}</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  {section.content}
                </pre>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComponentIntegration;