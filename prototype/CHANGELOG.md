# Changelog

## [0.3.0] - 2026-01-26

### Changed
- **Layout Refactor**:
  - Moved **Reset Canvas** button to the top of the Sidebar for better accessibility.
  - Moved **Templates** management to the Main Header as a dropdown menu (`TemplateControls`), clearing space in the sidebar.
  - Reduced Sidebar width to `w-56` (224px) to remove extra whitespace and align with component content.
- **Sidebar Cleanup**: Removed legacy `ComponentLibrary` code; streamlined `Sidebar.tsx`.

### Fixed
- **Critical Crash**: Resolved a "Blank Page" startup crash caused by a `Set` vs `Array` type mismatch in `App.tsx` when passing `usedTypes`.

## [0.2.0] - 2026-01-25

### Added (Advanced Features & Polish)
- **Advanced Drag & Drop**:
  - **Quadrant-Based Split Logic**: Drag to Top-Left/Right for vertical splits, Bottom for horizontal.
  - **Ghost Preview**: Blue overlay indicates exact split position; supports full-fill on blank canvas.
  - **Drop Logic Fix**: Improved coordinate calculation using drag delta.
- **Component & Template Management**:
  - **Templates**: Save, Load, and Delete layout templates via Sidebar.
  - **Reset Canvas**: Button to clear all components and local storage.
  - **Single Instance**: Prevents duplicate components where applicable.
- **UX Enhancements**:
  - **Undo/Redo**: Full history support with `Cmd+Z` / `Cmd+Shift+Z`.
  - **Keyboard Accessibility**: Arrow keys can now resize focused splitters.
  - **Mock Content**: Realistic visuals for Camera (Live feed), Traces (Graph), and Settings.
  - **Dark Mode**: Toggle switch added to header.
  - **Properties Panel**: Vertical stacking for better readability; moved to Left Sidebar.

### Fixed
- **Blank Canvas Reset**: Deleting the last item now correctly resets the root state.
- **Drag Coordinates**: Fixed offset issues during drag operations.

## [0.1.0] - 2026-01-25

### Added
- **Initial Prototype MVP**
  - Project setup with React + Vite + TypeScript.
  - TailwindCSS integration (v4 compatibility fixed).
  - Core Layout Components: `MainLayout`, `Sidebar`, `Canvas`, `PropertiesPanel`.
- **Drag and Drop**
  - Integrated `@dnd-kit` for drag-and-drop functionality.
  - Sidebar items ("Devices", "Application Specific Settings") are now draggable.
  - Canvas Grid Cells are valid drop targets (visual interaction only for P0).
- **Resizing Logic**
  - Implemented `Splitter` component for interactive resizing.
  - Recursive `layoutManager` logic to handle percent-based resizing of layout nodes.

### Changed
- **UI Refinements**
  - Moved Component Library to the LEFT sidebar.
  - Renamed application title to "Application Settings Editor".
  - Reorganized Component Library into "Devices" and "Application Specific Settings".
  - Removed "Add Custom Component" button and "Template" dropdown for a cleaner MVP interface.
  - Updated visual style to match "Scientific Precision" (clean, minimal, grayscale with blue accents).

### Fixed
- Resolved TailwindCSS v4 build errors by migrating to `@tailwindcss/postcss`.
- Fixed TypeScript linting errors in `App.tsx` and components.
- Cleanup of unused ports/processes.
