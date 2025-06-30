import { useState, useRef, useEffect } from 'react';

import searchIcon from '../../assets/SearchOutlined.svg'; // ✅ Correct import

const Header = ({ onAddClick, onSearchChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCreateModule = () => {
    onAddClick('module');
    setIsDropdownOpen(false);
  };

  const handleAddLink = () => {
    onAddClick('link');
    setIsDropdownOpen(false);
  };

  const handleUpload = () => {
    onAddClick('file');
    setIsDropdownOpen(false);
  };

  const handleSearchChange = e => {
    const query = e.target.value;
    onSearchChange(query);
  };

  return (
    <div className="header">
      <h1 className="header-title">Course builder</h1>
      <div className="header-right">
        <div className="search-container">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search modules or items..."
            className="search-input"
            onChange={handleSearchChange}
          />
        </div>
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="add-button" onClick={handleAddClick}>
            + Add
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleCreateModule}>
                <span className="item-icon">📄</span>
                Create module
              </button>
              <button className="dropdown-item" onClick={handleAddLink}>
                <span className="item-icon">🔗</span>
                Add a link
              </button>
              <button className="dropdown-item" onClick={handleUpload}>
                <span className="item-icon">⬆️</span>
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
