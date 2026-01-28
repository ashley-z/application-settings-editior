import React, { useState } from 'react'
import { MainLayout } from './layouts/MainLayout'
import { Sidebar, type AppSpecSettings } from './components/Sidebar'
import { TemplateControls } from './components/TemplateControls'

import { Canvas } from './components/Canvas'
import { DndContext, DragOverlay, type DragStartEvent, type DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import type { LayoutNode } from './types/layout';
import { splitNode, deleteNode, getUsedComponentTypes } from './logic/layoutManager';

// Mock Initial State (Recursive)
const initialLayout: LayoutNode = {
  id: 'root',
  type: 'component',
  parentId: null,
  weight: 100,
  componentType: undefined
};

// Preview State Type
type DragPreviewState = {
  targetId: string;
  direction: 'horizontal' | 'vertical';
  insertBefore: boolean;
  isReplace?: boolean;
} | null;

function App() {
  const [layout, setLayout] = useState<LayoutNode>(initialLayout);
  const [activeDragItem, setActiveDragItem] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<DragPreviewState>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to Light Mode
  const [appSpecSettings, setAppSpecSettings] = useState<AppSpecSettings>({
    camera: { frameRate: false, exposureTime: false, color: '#64748b' },
    led405: { intensity: false, frequency: false, color: '#1e74ad' },
    led470: { intensity: false, frequency: false, color: '#439639' },
    led560: { intensity: false, frequency: false, color: '#d12e1a' }
  });
  const [sectionOrder, setSectionOrder] = useState<string[]>(['led405', 'led470', 'led560', 'camera']);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load from local storage on mount
  React.useEffect(() => {
    const savedLayout = localStorage.getItem('polyScanLayout');
    if (savedLayout) {
      try {
        setLayout(JSON.parse(savedLayout));
      } catch (e) {
        console.error("Failed to parse layout", e);
      }
    }
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSave = () => {
    localStorage.setItem('polyScanLayout', JSON.stringify(layout));
    // Simple feedback for prototype
    alert('Layout saved to Local Storage!');
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const newLayout = deleteNode(layout, selectedId);
    if (newLayout) {
      updateLayout(newLayout);
    } else {
      // Reset to initial if root deleted? Or keep empty root.
      updateLayout(initialLayout);
    }
    setSelectedId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItem(event.active.data.current);
  };

  const handleDragMove = (event: DragEndEvent) => { // DragMoveEvent type is compatible
    const { active, over, activatorEvent } = event;

    if (!over || active.id === over.id) {
      setDragPreview(null);
      return;
    }

    // @ts-ignore
    const clientX = (activatorEvent.clientX || 0) + event.delta.x;
    // @ts-ignore
    const clientY = (activatorEvent.clientY || 0) + event.delta.y;

    const targetElement = document.getElementById(`cell-${over.id}`);
    if (!targetElement) {
      setDragPreview(null);
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    const percentX = relX / rect.width;
    const percentY = relY / rect.height;

    // Determine Split Direction
    let direction: 'horizontal' | 'vertical' = 'horizontal';
    let insertBefore = false;

    let isReplace = false;
    if (layout.id === over.id && !layout.componentType && (!layout.children || layout.children.length === 0)) {
      isReplace = true;
    }

    if (isReplace) {
      setDragPreview({ targetId: over.id as string, direction: 'horizontal', insertBefore: false, isReplace: true });
      return;
    }

    // Quadrant Logic
    if (percentY < 0.5) {
      // TOP HALF -> Vertical Split (Columns)
      direction = 'horizontal';
      if (percentX < 0.5) {
        // TOP LEFT -> New on Left
        insertBefore = true;
      } else {
        // TOP RIGHT -> New on Right
        insertBefore = false;
      }
    } else {
      // BOTTOM HALF -> Horizontal Split (Rows)
      direction = 'vertical';
      // Always drop on bottom
      insertBefore = false;
    }

    setDragPreview({ targetId: over.id as string, direction, insertBefore });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragItem(null);
    setDragPreview(null); // Clear preview
    const { active, over, activatorEvent } = event;

    if (over && active.id !== over.id) {
      // Get drop coordinates from the pointer event
      // @ts-ignore - activatorEvent is generally a PointerEvent or MouseEvent
      const clientX = (activatorEvent.clientX || 0) + event.delta.x;
      // @ts-ignore
      const clientY = (activatorEvent.clientY || 0) + event.delta.y;

      const targetElement = document.getElementById(`cell-${over.id}`);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      const percentX = relX / rect.width;
      const percentY = relY / rect.height;

      const componentType = active.data.current?.label || 'New Component';

      // Determine Split Direction
      // Simple heuristic: 
      // 1. If in center 40% (0.3 - 0.7), maybe just replace if empty?
      // 2. Else determine closest edge.

      let direction: 'horizontal' | 'vertical' = 'horizontal';
      let insertBefore = false;

      // Calculate distance to edges
      // Quadrant Logic
      if (percentY < 0.5) {
        // TOP HALF -> Vertical Split (Columns)
        direction = 'horizontal';
        if (percentX < 0.5) {
          // TOP LEFT -> New on Left
          insertBefore = true;
        } else {
          // TOP RIGHT -> New on Right
          insertBefore = false;
        }
      } else {
        // BOTTOM HALF -> Horizontal Split (Rows)
        direction = 'vertical';
        // Always drop on bottom
        insertBefore = false;
      }

      console.log('Split Debug:', {
        percentX: percentX.toFixed(2),
        percentY: percentY.toFixed(2),
        direction,
        insertBefore
      });

      // Wrapped in updateLayout for history
      updateLayout(prev => splitNode(prev, over.id as string, direction, componentType, insertBefore));
    }
  };

  const usedComponentTypes = React.useMemo(() => Array.from(getUsedComponentTypes(layout)), [layout]);

  const [templates, setTemplates] = useState<string[]>([]);

  // Load templates from local storage
  React.useEffect(() => {
    const savedTemplates = localStorage.getItem('polyScanTemplates');
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setTemplates(Object.keys(parsed));
      } catch (e) {
        console.error("Failed to parse templates", e);
      }
    }
  }, []);

  const handleSaveTemplate = (name: string) => {
    const savedTemplates = JSON.parse(localStorage.getItem('polyScanTemplates') || '{}');
    savedTemplates[name] = layout;
    localStorage.setItem('polyScanTemplates', JSON.stringify(savedTemplates));
    setTemplates(Object.keys(savedTemplates));
    alert(`Template "${name}" saved!`);
  };

  const handleLoadTemplate = (name: string) => {
    const savedTemplates = JSON.parse(localStorage.getItem('polyScanTemplates') || '{}');
    if (savedTemplates[name]) {
      if (confirm(`Load template "${name}"? Unsaved changes will be lost.`)) {
        updateLayout(savedTemplates[name]);
        setSelectedId(null);
      }
    }
  };

  const handleDeleteTemplate = (name: string) => {
    if (confirm(`Delete template "${name}"?`)) {
      const savedTemplates = JSON.parse(localStorage.getItem('polyScanTemplates') || '{}');
      delete savedTemplates[name];
      localStorage.setItem('polyScanTemplates', JSON.stringify(savedTemplates));
      setTemplates(Object.keys(savedTemplates));
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the layout? This cannot be undone.')) {
      updateLayout(initialLayout);
      setSelectedId(null);
      localStorage.removeItem('polyScanLayout');
    }
  };

  // History State
  const [history, setHistory] = useState<LayoutNode[]>([initialLayout]);
  const [currentStep, setCurrentStep] = useState(0);

  // Wrapper to update layout and push to history
  const updateLayout = (newLayout: LayoutNode | ((prev: LayoutNode) => LayoutNode)) => {
    setLayout(prev => {
      const resolvedLayout = typeof newLayout === 'function' ? newLayout(prev) : newLayout;

      // Simple deep compare to avoid duplicate history entries
      if (JSON.stringify(prev) === JSON.stringify(resolvedLayout)) {
        return prev;
      }

      const newHistory = history.slice(0, currentStep + 1);
      newHistory.push(resolvedLayout);
      setHistory(newHistory);
      setCurrentStep(newHistory.length - 1);

      return resolvedLayout;
    });
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setLayout(history[prevStep]);
      setSelectedId(null);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setLayout(history[nextStep]);
      setSelectedId(null);
    }
  };

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, history]); // Re-bind when history state changes

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <MainLayout
        sidebar={<Sidebar
          usedTypes={usedComponentTypes}
          appSpecSettings={appSpecSettings}
          onAppSpecSettingsChange={setAppSpecSettings}
          sectionOrder={sectionOrder}
          onSectionOrderChange={setSectionOrder}
          selectedId={selectedId}
          onDelete={handleDelete}
        />}
        headerActions={
          <TemplateControls
            templates={templates}
            onSaveTemplate={handleSaveTemplate}
            onLoadTemplate={handleLoadTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        }
        canvas={<Canvas layout={layout} setLayout={updateLayout} selectedId={selectedId} onSelect={setSelectedId} dragPreview={dragPreview} appSpecSettings={appSpecSettings} sectionOrder={sectionOrder} />}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
      />
      <DragOverlay>
        {activeDragItem ? (
          <div className="p-3 bg-card border border-primary shadow-lg rounded opacity-80 w-48">
            {activeDragItem.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default App
