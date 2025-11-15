import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ 
  title = 'Something went wrong', 
  message = 'We encountered an error. Please try again.',
  onRetry,
  testId = 'error-state'
}) => {
  return (
    <Card 
      className="text-center py-12 border-red-200 bg-red-50 animate-fade-in" 
      data-testid={testId}
    >
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <div>
            <h3 className="text-h3 mb-2 text-red-900">{title}</h3>
            <p className="text-body text-red-700 mb-6 max-w-md mx-auto">
              {message}
            </p>
          </div>
          {onRetry && (
            <Button 
              variant="default" 
              size="lg" 
              onClick={onRetry}
              className="h-12"
              data-testid="retry-button"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
