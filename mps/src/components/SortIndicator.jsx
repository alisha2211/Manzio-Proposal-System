import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import './SortIndicator.css';

/**
 * SortIndicator – displays the current sort direction for a column.
 * Props:
 *   col: string – column identifier
 *   sort: string – currently sorted column
 *   sortDir: 'asc' | 'desc' – direction
 *   onToggle: (col: string) => void – callback to change sort
 */
export default function SortIndicator({ col, sort, sortDir, onToggle }) {
  const isActive = sort === col;
  const handleClick = () => onToggle(col);
  return (
    <button className="sort-indicator" onClick={handleClick} aria-label={`Sort by ${col}`}>
      {isActive ? (
        sortDir === 'asc' ? <ChevronUp size={12} className="sort-icon" /> : <ChevronDown size={12} className="sort-icon" />
      ) : (
        <ArrowUpDown size={12} className="sort-icon sort-icon--inactive" />
      )}
    </button>
  );
}
