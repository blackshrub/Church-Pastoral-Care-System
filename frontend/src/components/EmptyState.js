import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  testId = 'empty-state'
}) => {
  return (
    <Card className="text-center py-12 animate-fade-in" data-testid={testId}>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {Icon && (
            <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center">
              <Icon className="h-12 w-12 text-teal-500" />
            </div>
          )}
          <div>
            <h3 className="text-h3 mb-2">{title}</h3>
            <p className="text-body text-muted-foreground mb-6 max-w-md mx-auto">
              {description}
            </p>
          </div>
          {actionLabel && onAction && (
            <Button 
              variant="default" 
              size="lg" 
              onClick={onAction}
              className="h-12"
              data-testid={`${testId}-action-button`}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
