
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MarketingEmptyStateProps {
  title: string;
  description: string;
  createPath: string;
  createLabel: string;
  icon?: React.ReactNode;
}

const MarketingEmptyState: React.FC<MarketingEmptyStateProps> = ({
  title,
  description,
  createPath,
  createLabel,
  icon = <SearchX className="h-10 w-10 text-muted-foreground mb-4" />
}) => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        {icon}
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
        <Button asChild>
          <Link to={createPath}>
            <Plus className="mr-2 h-4 w-4" />
            {createLabel}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MarketingEmptyState;
