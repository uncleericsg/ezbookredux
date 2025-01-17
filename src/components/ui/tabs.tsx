import * as React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const Tabs = ({ value, onValueChange, children }: TabsProps) => {
  return (
    <div className="tabs">
      {React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement, {
          value,
          onValueChange
        })
      )}
    </div>
  );
};

const TabsList = ({ children }: TabsListProps) => {
  return <div className="tabs-list">{children}</div>;
};

const TabsTrigger = ({ value, children }: TabsTriggerProps) => {
  return <button className="tabs-trigger">{children}</button>;
};

const TabsContent = ({ value, children, className }: TabsContentProps) => {
  return <div className={`tabs-content ${className || ''}`}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };