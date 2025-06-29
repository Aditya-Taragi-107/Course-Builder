import { useRef, useState, useEffect } from 'react';
import './Outline.css';

const Outline = ({ modules, currentModuleId, onClick }) => {
  const listRef = useRef();
  const itemRefs = useRef({});
  const [highlight, setHighlight] = useState({ top: 0, height: 0 });
  const [contentHeight, setContentHeight] = useState(0);

  // Determine which module should be active (bold)
  const effectiveActiveId =
    modules.length === 1 ? modules[0]?.id : currentModuleId;

  useEffect(() => {
    if (!effectiveActiveId || !listRef.current) return;
    const listRect = listRef.current.getBoundingClientRect();
    const activeEl = itemRefs.current[effectiveActiveId];
    if (activeEl) {
      const activeRect = activeEl.getBoundingClientRect();
      const top = activeRect.top - listRect.top;
      const height = activeRect.height;
      setHighlight({
        top: Math.max(0, top),
        height: Math.max(4, height),
      });
    }
  }, [effectiveActiveId, modules]);

  useEffect(() => {
    if (listRef.current) {
      setContentHeight(listRef.current.offsetHeight);
    }
  }, [modules]);

  return (
    <div className="outline">
      <div className="outline-slider" style={{ height: contentHeight }}>
        <div className="sidebar-stem"></div>
        <div
          className="sidebar-highlight"
          style={{
            top: highlight.top,
            height: highlight.height,
            position: 'absolute',
            left: 5,
            width: effectiveActiveId ? 6 : 4,
            background: effectiveActiveId ? '#000' : '#111',
            borderRadius: 4,
            zIndex: 2,
            transition: 'top 0.2s, height 0.2s, width 0.2s, background 0.2s',
            boxShadow: effectiveActiveId
              ? '0 0 4px rgba(0,0,0,0.5)'
              : '0 0 2px rgba(0,0,0,0.3)',
          }}
        ></div>
      </div>
      <ul className="outline-list" ref={listRef}>
        {modules.map(mod => {
          const isActive = mod.id === effectiveActiveId;
          return (
            <li
              key={mod.id}
              ref={el => (itemRefs.current[mod.id] = el)}
              className={`outline-item${isActive ? ' active' : ''}`}
              onClick={() => onClick(mod.id)}
            >
              {mod.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Outline;
