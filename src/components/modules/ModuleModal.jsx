import { useState, useEffect } from 'react';

const ModuleModal = ({ isOpen, onClose, onSave, module = null }) => {
  const [moduleTitle, setModuleTitle] = useState('');

  useEffect(() => {
    if (module) {
      setModuleTitle(module.title || '');
    } else {
      setModuleTitle('');
    }
  }, [module]);

  const handleSubmit = e => {
    e.preventDefault();

    const trimmedTitle = moduleTitle.trim();
    if (!trimmedTitle) return;

    onSave({
      id: module ? module.id : Date.now().toString(),
      title: trimmedTitle,
    });

    setModuleTitle('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{module ? 'Edit Module' : 'Create New Module'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="module-title">Module Name</label>
              <input
                id="module-title"
                type="text"
                value={moduleTitle}
                onChange={e => setModuleTitle(e.target.value)}
                placeholder="e.g. Introduction to Trigonometry"
                className="form-input"
                autoFocus
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              {module ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleModal;
