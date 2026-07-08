import './PillTabs.css';
import { motion } from 'framer-motion';

/**
 * PillTabs – simple pill‑style tab navigation.
 * Props:
 *   tabs: [{ id: string, label: string }]
 *   activeId: string – currently selected tab id
 *   onChange: (id) => void – callback when tab is clicked
 */
export default function PillTabs({ tabs, activeId, onChange }) {
  return (
    <div className="pill-tabs">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={`pill-tab ${tab.id === activeId ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}
