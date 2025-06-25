// components/SwitchCheckbox.jsx
import { Checkbox } from '@shopify/polaris';
import './SwitchCheckbox.css';

const SwitchCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="custom-polaris-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track"></span>
      <span className="switch-label">{label}</span>
    </label>
  );
};

export default SwitchCheckbox;
