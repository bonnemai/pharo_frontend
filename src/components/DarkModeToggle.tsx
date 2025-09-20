import { Switch } from 'antd';

type Props = {
  darkMode: boolean;
  onToggle: () => void;
};

export default function DarkModeToggle({ darkMode, onToggle }: Props) {
  return (
    <div className="dark-toggle">
      <Switch
        checked={darkMode}
        onChange={onToggle}
        checkedChildren="Dark"
        unCheckedChildren="Light"
        className="dark-toggle__switch"
      />
    </div>
  );
}
