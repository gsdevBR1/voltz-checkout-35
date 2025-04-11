
import React from 'react';
import { cn } from '@/lib/utils';

interface FunnelItem {
  value: number;
  name: string;
  percentage: number;
  color?: string;
}

interface FunnelChartProps {
  data: FunnelItem[];
  className?: string;
  showDividers?: boolean;
}

export function FunnelChart({ data, className, showDividers = true }: FunnelChartProps) {
  // Calculate maximum width based on the first item (should be 100%)
  const maxValue = data[0]?.value || 1;
  
  return (
    <div className={cn("w-full flex flex-col space-y-6", className)}>
      {data.map((item, index) => {
        const widthPercent = (item.value / maxValue) * 100;
        // Width reduces as we go down the funnel
        const width = `${Math.max(widthPercent, 5)}%`;
        
        return (
          <React.Fragment key={item.name}>
            <div className="w-full flex flex-col space-y-2">
              <div className="flex flex-row items-center justify-between">
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="flex flex-col items-end">
                  <div className="text-base font-medium">{item.name}</div>
                  <div className="text-lg font-semibold text-muted-foreground">{item.percentage}%</div>
                </div>
              </div>
              
              <div className="w-full bg-muted/30 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ 
                    width,
                    backgroundColor: item.color || 'hsl(var(--primary))'
                  }}
                ></div>
              </div>
            </div>
            
            {showDividers && index < data.length - 1 && (
              <div className="w-full h-px bg-border" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
