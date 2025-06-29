import { useState, useEffect } from 'react';

const LinkModal = ({ isOpen, onClose, onSave, moduleId }) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkURL, setLinkURL] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setLinkTitle('');
      setLinkURL('');
    }
  }, [isOpen]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkURL.trim()) return;

    const newLink = {
      id: Date.now().toString(),
      moduleId: moduleId ?? null, // ensure null if unassigned
      type: 'link',
      title: linkTitle.trim(),
      url: linkURL.trim(),
    };

    onSave(newLink);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add a Link</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="link-title">Link Title</label>
              <input
                id="link-title"
                type="text"
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
                placeholder="e.g. Course Overview"
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="link-url">URL</label>
              <input
                id="link-url"
                type="url"
                value={linkURL}
                onChange={e => setLinkURL(e.target.value)}
                placeholder="https://example.com"
                className="form-input"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={!linkTitle.trim() || !linkURL.trim()}
            >
              Add Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
