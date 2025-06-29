import { useState, useRef, useEffect } from 'react';

import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';

import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleItem from './ModuleItem';
import ModuleModal from './ModuleModal';
import Outline from './Outline';
import UploadModal from './UploadModal';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const [activeModuleId, setActiveModuleId] = useState(null);
  const moduleRefs = useRef({});

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = query => {
    setSearchQuery(query.toLowerCase());
  };

  const handleAddClick = type => {
    setCurrentModuleId(null); // reset for clean creation context

    if (type === 'module') {
      setCurrentModule(null);
      setIsModuleModalOpen(true);
    } else if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveModule = module => {
    if (currentModule) {
      setModules(prev => prev.map(m => (m.id === module.id ? module : m)));
    } else {
      setModules([
        ...modules,
        { id: Date.now().toString(), title: module.title },
      ]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    setItems(prev => prev.filter(item => item.moduleId !== moduleId));
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') setIsLinkModalOpen(true);
    else if (type === 'file') setIsUploadModalOpen(true);
  };

  const handleSaveLink = linkItem => {
    setItems(prev => [
      ...prev,
      { ...linkItem, moduleId: currentModuleId ?? null },
    ]);
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveUpload = fileItem => {
    setItems(prev => [
      ...prev,
      { ...fileItem, moduleId: currentModuleId ?? null },
    ]);
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleDeleteItem = itemId => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleRenameItem = (itemId, newTitle) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, title: newTitle } : item
      )
    );
  };

  const moveModule = (fromIndex, toIndex) => {
    const updated = [...modules];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setModules(updated);
  };

  const moveItem = (draggedItem, targetItem) => {
    setItems(prev => {
      const updated = [...prev];

      // Find the dragged item in the global array
      const draggedIndex = updated.findIndex(i => i.id === draggedItem.id);
      if (draggedIndex === -1) return prev;

      // Update the dragged item's moduleId to match the target
      updated[draggedIndex] = {
        ...updated[draggedIndex],
        moduleId: targetItem.moduleId,
      };

      // If moving within the same module, we need to reorder
      if (draggedItem.moduleId === targetItem.moduleId) {
        // Find all items in the same module
        const moduleItems = updated.filter(
          item => item.moduleId === targetItem.moduleId
        );
        const moduleItemIds = moduleItems.map(item => item.id);

        // Find the target item's position in the module
        const targetModuleIndex = moduleItemIds.indexOf(targetItem.id);
        if (targetModuleIndex === -1) return prev;

        // Remove the dragged item from its current position
        const [movedItem] = updated.splice(draggedIndex, 1);

        // Find the new position in the global array
        const targetGlobalIndex = updated.findIndex(
          item => item.id === targetItem.id
        );
        if (targetGlobalIndex === -1) {
          // If target not found, append to the end
          updated.push(movedItem);
        } else {
          // Insert at the target position
          updated.splice(targetGlobalIndex, 0, movedItem);
        }
      }
      // If moving between modules, the moduleId update above is sufficient

      return updated;
    });
  };

  const assignItemToModule = (itemId, moduleId) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, moduleId: moduleId } : item
      )
    );
  };

  const handleOutlineClick = moduleId => {
    setActiveModuleId(moduleId);
    const el = moduleRefs.current[moduleId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let closestId = null;
      let minOffset = Infinity;

      Object.entries(moduleRefs.current).forEach(([id, el]) => {
        const offset = Math.abs(el.getBoundingClientRect().top);
        if (offset < minOffset) {
          minOffset = offset;
          closestId = id;
        }
      });

      setActiveModuleId(closestId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredModules = modules.filter(mod => {
    const titleMatch = mod.title.toLowerCase().includes(searchQuery);

    const hasMatchingItem = items.some(
      item =>
        item.moduleId === mod.id &&
        item.title.toLowerCase().includes(searchQuery)
    );

    return titleMatch || hasMatchingItem;
  });

  const unassignedItems = items.filter(
    item =>
      item.moduleId === null &&
      (!searchQuery || item.title.toLowerCase().includes(searchQuery))
  );

  return (
    <div className="course-builder">
      <Header onAddClick={handleAddClick} onSearchChange={handleSearchChange} />

      <div className="builder-layout">
        <div className="main-content">
          {filteredModules.length === 0 && unassignedItems.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {unassignedItems.length > 0 && (
                <div
                  className="module-items-list"
                  style={{ marginBottom: '24px' }}
                >
                  {unassignedItems.map((item, index) => (
                    <ModuleItem
                      key={item.id}
                      item={item}
                      index={index}
                      moduleId={null}
                      moveItem={moveItem}
                      onDelete={handleDeleteItem}
                      onRename={handleRenameItem}
                    />
                  ))}
                </div>
              )}

              <div className="module-list">
                {filteredModules.map((module, index) => {
                  // Filter items to only include those belonging to this module
                  const moduleItems = items.filter(
                    item => item.moduleId === module.id
                  );

                  return (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      index={index}
                      moveModule={moveModule}
                      items={moduleItems}
                      onEdit={handleEditModule}
                      onDelete={handleDeleteModule}
                      onAddItem={handleAddItem}
                      onDeleteItem={handleDeleteItem}
                      onRename={handleRenameItem}
                      moveItem={moveItem}
                      assignItemToModule={assignItemToModule}
                      moduleRef={el => (moduleRefs.current[module.id] = el)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>

        <Outline
          modules={filteredModules}
          currentModuleId={activeModuleId}
          onClick={handleOutlineClick}
        />
      </div>

      {/* Modals */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
      />
    </div>
  );
};

export default CourseBuilder;
