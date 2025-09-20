import { Radio } from 'antd';

const OPTIONS = [
  { key: 'light', icon: '☀️', label: 'Light', value: false },
  { key: 'dark', icon: '🌙', label: 'Dark', value: true },
] as const;

type Props = {
  darkMode: boolean;
  onChange: (value: boolean) => void;
};

export default function DarkModeToggle({ darkMode, onChange }: Props) {
  return (
    <Radio.Group
      className="mode-toggle"
      optionType="button"
      value={darkMode}
      onChange={event => onChange(event.target.value as boolean)}
    >
      {OPTIONS.map(option => (
        <Radio.Button key={option.key} value={option.value} className="mode-toggle__button">
          <span className="mode-toggle__icon" aria-hidden>{option.icon}</span>
          <span className="mode-toggle__label">{option.label}</span>
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
