import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@components/atoms/alert';
import { Button } from '@components/atoms/button';
import { Card } from '@components/molecules/card';

interface ErrorDisplayProps {
  error: Error | string;
  resetErrorBoundary?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  resetErrorBoundary,
  className = ''
}) => {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={className}
    >
      <Card className="border-red-200 bg-red-50/50">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{errorMessage}</p>
            {resetErrorBoundary && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetErrorBoundary}
                className="mt-2"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </Card>
    </motion.div>
  );
};

export default ErrorDisplay;
