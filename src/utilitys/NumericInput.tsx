import { NumericFormat } from 'react-number-format';

interface NumericInputProps {
  value: string;
  onChange: (val: string) => void;
  prefix?: string;
  suffix?: string;
  decimalScale?: number;
  className?: string;
  id?: string;
  placeholder?: string;
}

export default function NumericInput({
  value,
  onChange,
  prefix,
  suffix,
  decimalScale = 2,
  className = "num-input",
  id,
  placeholder,
}: NumericInputProps) {
  return (
    <NumericFormat
      id={id}
      className={className}
      value={value}
      placeholder={placeholder}
      onValueChange={(values) => onChange(values.value)}
      thousandSeparator
      prefix={prefix}
      suffix={suffix}
      decimalScale={decimalScale}
      allowNegative={false}
      inputMode="decimal"
      autoComplete="off"
    />
  );
}
