import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

declare const require: (id: string) => any;

vi.mock('antd', () => {
  const React = require('react');

  const RadioButton = ({ value, isSelected, onSelect, className, children }: any) => (
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

  const RadioGroup = ({ value, onChange, children, optionType: _optionType, ...rest }: any) => (
    <div data-value={String(value)} {...rest}>
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          ...child.props,
          isSelected: child.props.value === value,
          onSelect: (val: boolean) => onChange({ target: { value: val } }),
        })
      )}
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
