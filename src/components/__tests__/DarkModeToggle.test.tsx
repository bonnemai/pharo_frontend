import { render, screen, fireEvent } from '@testing-library/react';
import type { HTMLAttributes, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

declare const require: (id: string) => any;

type RadioGroupChangeEvent = {
  target: {
    value: boolean;
  };
};

type MockRadioButtonProps = {
  value: boolean;
  isSelected: boolean;
  onSelect: (value: boolean) => void;
  className?: string;
  children: ReactNode;
};

type MockRadioGroupProps = HTMLAttributes<HTMLDivElement> & {
  value: boolean;
  onChange: (event: RadioGroupChangeEvent) => void;
  optionType?: 'default' | 'button';
  children: ReactNode;
};

vi.mock('antd', () => {
  const React = require('react') as typeof import('react');

  const RadioButton = ({ value, isSelected, onSelect, className, children }: MockRadioButtonProps) => (
    <button
      type="button"
      data-value={String(value)}
      data-selected={isSelected ? 'true' : 'false'}
      className={className}
      onClick={() => onSelect(value)}
    >
      {children}
    </button>
  );

  const RadioGroup = ({ value, onChange, children, optionType: _optionType, ...rest }: MockRadioGroupProps) => (
    <div data-value={String(value)} {...rest}>
      {React.Children.map(children, child => {
        if (!React.isValidElement<MockRadioButtonProps>(child)) {
          return child;
        }

        return React.cloneElement(child, {
          ...child.props,
          isSelected: child.props.value === value,
          onSelect: (val: boolean) => onChange({ target: { value: val } }),
        });
      })}
    </div>
  );

  return {
    Radio: {
      Group: RadioGroup,
      Button: RadioButton,
    },
  };
});

import DarkModeToggle from '../DarkModeToggle';

describe('DarkModeToggle', () => {
  it('shows light selected when darkMode is false', () => {
    render(<DarkModeToggle darkMode={false} onChange={() => undefined} />);

    const lightOption = screen.getByRole('button', { name: /light/i });
    const darkOption = screen.getByRole('button', { name: /dark/i });

    expect(lightOption).toHaveAttribute('data-selected', 'true');
    expect(darkOption).toHaveAttribute('data-selected', 'false');
  });

  it('calls onChange with a boolean when toggled', () => {
    const handleChange = vi.fn();

    render(<DarkModeToggle darkMode={false} onChange={handleChange} />);

    fireEvent.click(screen.getByRole('button', { name: /dark/i }));

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
