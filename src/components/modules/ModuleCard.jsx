import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import ModuleItem from './ModuleItem';
import './ModuleCard.css';

const ModuleCard = ({
  module,
  index,
  moveModule,
  moduleRef,
  items = [],
  onEdit,
  onDelete,
  onAddItem,
  onDeleteItem,
  onRename,
  moveItem,
  assignItemToModule,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setIsOptionsOpen(false);
    setIsAddMenuOpen(false);
  };

  const handleEdit = () => {
    onEdit(module);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    onDelete(module.id);
    setIsOptionsOpen(false);
  };

  const toggleAddMenu = e => {
    e.stopPropagation();
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const handleAddClick = type => {
    onAddItem(module.id, type);
    setIsAddMenuOpen(false);
  };

  const renderAddItemMenu = () => (
    <div className="add-item-menu">
      <button
        className="add-item-option"
        onClick={() => handleAddClick('link')}
      >
        🔗 Add a link
      </button>
      <button
        className="add-item-option"
        onClick={() => handleAddClick('file')}
      >
        ⬆️ Upload file
      </button>
    </div>
  );

  // Drag & drop for module
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ['MODULE'],
    hover(draggedItem) {
      if (draggedItem.index === index) return;
      moveModule(draggedItem.index, index);
      draggedItem.index = index;
    },
  });

  const [, drag] = useDrag({
    type: 'MODULE',
    item: { index },
  });

  // Drop target for unassigned ITEMs into this module
  const [{ isOver }, dropItemHere] = useDrop({
    accept: 'ITEM',
    drop: draggedItem => {
      if (draggedItem.moduleId !== module.id) {
        assignItemToModule(draggedItem.id, module.id);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  // Combine drag and drop refs
  const combinedRef = node => {
    ref.current = node;
    if (moduleRef) moduleRef(node);
    drop(dropItemHere(node));
  };

  drag(drop(ref));

  return (
    <div
      ref={combinedRef}
      className={`module-card-container ${isOver ? 'drop-target' : ''}`}
    >
      <div className="module-card" onClick={toggleExpanded}>
        <div className="module-content">
          <div className="module-icon">
            <span className={`icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          <div className="module-info">
            <h3 className="module-title">{module.title}</h3>
            <p className="module-subtitle">
              {items.length === 0
                ? 'Add items to this module'
                : `${items.length} item${items.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="module-actions">
          <button className="btn-options" onClick={toggleOptions}>
            ⋮
          </button>
          {isOptionsOpen && (
            <div className="options-menu">
              <button className="option-item" onClick={handleEdit}>
                ✏️ Edit module name
              </button>
              <button className="option-item delete" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="module-content-expanded">
          {items.length === 0 ? (
            <div className="empty-module-content">
              <p className="empty-module-message">
                No content added to this module yet.
              </p>
            </div>
          ) : (
            <div className="module-items">
              <div className="module-items-list">
                {items.map((item, i) => (
                  <ModuleItem
                    key={item.id}
                    item={item}
                    index={i}
                    moduleId={module.id}
                    onDelete={onDeleteItem}
                    moveItem={moveItem}
                    onRename={onRename}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="add-item-container">
            <button className="add-item-button" onClick={toggleAddMenu}>
              <span className="add-icon">+</span> Add item
            </button>
            {isAddMenuOpen && renderAddItemMenu()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
