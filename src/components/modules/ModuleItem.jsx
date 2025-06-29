import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ModuleItem = ({
  item,
  index,
  moduleId,
  moveItem,
  onDelete,
  onRename,
}) => {
  const ref = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);

  const toggleMenu = e => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  const handleDelete = () => {
    onDelete(item.id);
    setIsMenuOpen(false);
  };

  const handleRename = () => {
    setIsRenameModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleSaveRename = () => {
    if (newTitle.trim()) {
      onRename(item.id, newTitle.trim());
      setIsRenameModalOpen(false);
      setNewTitle(item.title);
    }
  };

  const handleCancelRename = () => {
    setIsRenameModalOpen(false);
    setNewTitle(item.title);
  };

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover(draggedItem, monitor) {
      if (!monitor.isOver({ shallow: true })) return;
      if (draggedItem.id === item.id) return;

      moveItem(draggedItem, { ...item, index, moduleId });
      draggedItem.index = index;
      draggedItem.moduleId = moduleId;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { ...item, index, moduleId },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const isLink = item.type === 'link';
  const isFile = item.type === 'file';

  return (
    <>
      <div ref={ref} className={`module-item ${isDragging ? 'dragging' : ''}`}>
        <div className="item-content">
          <div
            className="item-icon"
            style={{
              backgroundColor: isLink ? '#E0F7FA' : '#FCE8E6',
              color: isLink ? '#00ACC1' : '#E53935',
            }}
          >
            {isLink ? (
              '🔗'
            ) : item.fileType === 'application/pdf' ? (
              <img
                src="src/assets/PDFColored.svg"
                alt="PDF"
                style={{ width: '20px', height: '20px' }}
              />
            ) : (
              '📄'
            )}
          </div>
          <div className="item-info">
            <h4 className="item-title">{item.title}</h4>

            {isLink && (
              <a
                href={item.url}
                className="item-url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.url}
              </a>
            )}

            {isFile && (
              <p className="item-details">
                {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
              </p>
            )}
          </div>
        </div>

        <div className="item-menu">
          <button className="item-menu-toggle" onClick={toggleMenu}>
            ⋮
          </button>

          {isMenuOpen && (
            <div className="item-menu-dropdown">
              <button className="dropdown-rename" onClick={handleRename}>
                ✏️ Rename
              </button>
              <button className="dropdown-delete" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rename Modal */}
      {isRenameModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Rename {isLink ? 'Link' : 'File'}</h2>
              <button className="modal-close" onClick={handleCancelRename}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="rename-title">Title</label>
                <input
                  id="rename-title"
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancelRename}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-create"
                onClick={handleSaveRename}
                disabled={!newTitle.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModuleItem;
