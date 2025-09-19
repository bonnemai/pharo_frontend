import { Switch } from 'antd';

type Props = {
  darkMode: boolean;
  onToggle: () => void;
};

export default function DarkModeToggle({ darkMode, onToggle }: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Switch checked={darkMode} onChange={onToggle} checkedChildren="Dark" unCheckedChildren="Light" />
    </div>
  );
}
