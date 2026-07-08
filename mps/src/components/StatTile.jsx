import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './ui.jsx';
import './StatTile.css';

/**
 * StatTile – reusable metric card with gradient background, icon, animated value.
 * Props:
 *  - label: string
 *  - value: number or string
 *  - icon: React component (Lucide icon)
 *  - gradient: CSS gradient string for background
 *  - glow: CSS box-shadow color for subtle glow
 *  - isMoney: boolean (optional) – if true, prefixes with currency symbol and formats.
 *  - trend: string (optional) – text displayed under value.
 *  - trendUp: boolean (optional) – determines trend style.
 */
export default function StatTile({ label, value, icon: Icon, gradient, glow, isMoney = false, trend, trendUp = true }) {
  // Extract clean theme colors dynamically based on the label
  const labelLower = label.toLowerCase();
  const theme = labelLower.includes('total')
    ? { primary: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)', glow: 'rgba(59, 130, 246, 0.12)' }
    : labelLower.includes('pipeline')
    ? { primary: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', glow: 'rgba(139, 92, 246, 0.12)' }
    : labelLower.includes('accepted')
    ? { primary: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', glow: 'rgba(16, 185, 129, 0.12)' }
    : { primary: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', glow: 'rgba(245, 158, 11, 0.12)' };

  return (
    <motion.div 
      className="stat-tile-new" 
      style={{ 
        borderTop: `3px solid ${theme.primary}`,
        boxShadow: `0 8px 30px var(--shadow-sm), 0 0 15px ${theme.glow}`
      }} 
      whileHover={{ y: -4 }}
    >
      <div className="stat-tile-top">
        <span className="stat-tile-label">{label}</span>
        <div className="stat-tile-icon" style={{ backgroundColor: theme.bg }}>
          {Icon && <Icon size={18} color={theme.primary} />}
        </div>
      </div>
      <div className="stat-tile-value">
        {isMoney ? (
          <span>₹<AnimatedCounter value={value / 100000} decimals={1} suffix="L" /></span>
        ) : (
          <AnimatedCounter value={value} />
        )}
      </div>
      {trend && (
        <div className={`stat-tile-trend ${trendUp ? 'trend-up' : 'trend-neutral'}`}>
          {trendUp ? <span style={{ color: '#10B981' }}>↑</span> : <span style={{ color: '#F59E0B' }}>→</span>} <span>{trend}</span>
        </div>
      )}
    </motion.div>
  );
}
