# Application Settings Editor Prototype

A high-fidelity **React Prototype** of the Application Settings Editor for PolyScan.
This project validates the UX/UI for the visual layout configuration tool described in the PRD.

## 🚀 Features

- **Visual Layout Canvas**: A responsive grid system representing the workspace.
- **Advanced Drag & Drop**:
  - **Quadrant Splitting**: Drop on edges/corners to create Row or Column splits.
  - **Ghost Preview**: Visual overlay confirms split direction before drop.
- **Component Management**:
  - **Templates**: Save and Load custom layouts via the **Main Header**.
  - **Library**: Sidebar with "Devices" (Camera, Traces, LEDs) and "Settings".
  - **Reset**: Instantly clear the workspace (Top of Sidebar).
- **UX & Accessibility**:
  - **Undo/Redo**: Robust history stack with keyboard shortcuts.
  - **Keyboard Resizing**: Fine-tune splitter positions with Arrow keys.
  - **Dark Mode**: Fully themed UI.
  - **Mock Content**: Realistic previews for Cameras and Graphs.
  - **Properties Panel**: Context-aware settings for selected items.
- **Scientific Aesthetic**: Clean, modern UI using TailwindCSS.

## � Technical Rules

### 1. Quadrant Splitting Logic
The layout engine uses a **Quadrant-Based** detection system when dragging components:
- **Vertical Split (Columns)**: Drop in the **Top Half** of a cell.
  - **Top-Left**: Inserts new component to the **Left**.
  - **Top-Right**: Inserts new component to the **Right**.
- **Horizontal Split (Rows)**: Drop in the **Bottom Half** of a cell.
  - Always inserts the new component **Below** the target.
- **Ghost Preview**: A blue overlay will appear before you drop, confirming exactly how the split will occur.

### 2. Scroll Bar Logic
- **Component-Level Scrolling**: Scroll bars are managed internally by each component, not the global canvas.
- **Trigger**: A vertical scroll bar will automatically appear **inside a component** if its content (settings, graphs, controls) exceeds the height of its grid cell.
- **Best Practice**: Resize grid cells using the drag handles to eliminate scroll bars for optimal visibility.

## �🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Drag & Drop**: `@dnd-kit/core`
- **Icons**: `lucide-react`

## 🏃‍♂️ Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open the URL shown in the terminal (e.g., `http://localhost:5176`).

3. **Build for Production**
   ```bash
   npm run build
   ```

## 📝 Roadmap

See `implementation_plan.md` for upcoming P1/P2 priorities.
