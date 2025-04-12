
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | null;
  onChange: (value: number | null) => void;
  error?: boolean;
  className?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, error, className, disabled, placeholder, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    // Format number to Brazilian Real
    const formatToCurrency = (value: number | null): string => {
      if (value === null || isNaN(Number(value))) return "";
      
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    // Convert string like "R$ 1.234,56" to number like 1234.56
    const parseCurrencyToNumber = (value: string): number | null => {
      if (!value) return null;
      
      // Remove currency symbol, spaces and dots, then replace comma with dot
      const parsed = value
        .replace(/[R$\s.]/g, '')
        .replace(',', '.');
      
      const number = parseFloat(parsed);
      return isNaN(number) ? null : number;
    };

    useEffect(() => {
      // Update displayed value when the actual value changes
      setDisplayValue(formatToCurrency(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // If it's empty or just the currency symbol, set to empty
      if (!inputValue || inputValue === "R$ ") {
        setDisplayValue("");
        onChange(null);
        return;
      }

      // Allow only valid input: Remove anything that's not a digit, comma, dot, currency symbol, or space
      const cleanInput = inputValue.replace(/[^0-9,. R$]/g, '');
      
      // Ensure we have only one comma or dot for decimal
      const normalizedInput = cleanInput.replace(/[,.]/g, match => 
        match === ',' ? ',' : '.'
      ).replace(/,/g, '.').replace(/\./g, ',');
      
      // Parse to number and format back to currency
      const numberValue = parseCurrencyToNumber(normalizedInput);
      
      // Only update if it's a valid number or empty
      if (numberValue !== null || normalizedInput === "" || normalizedInput === "R$ ") {
        setDisplayValue(normalizedInput);
        onChange(numberValue);
      }
    };

    const handleBlur = () => {
      // When the input loses focus, format the value properly
      if (value !== null) {
        setDisplayValue(formatToCurrency(value));
      } else {
        setDisplayValue("");
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder || "R$ 0,00"}
          className={cn(
            "text-right pr-2",
            error ? "border-red-500 focus-visible:ring-red-500" : "",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
