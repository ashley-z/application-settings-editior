import React from 'react';
import { Save, LayoutGrid, RotateCcw, RotateCw, Play, Moon, Sun } from 'lucide-react';

interface MainLayoutProps {
    sidebar: React.ReactNode;
    canvas: React.ReactNode;
    properties: React.ReactNode;
    isDarkMode: boolean;
    toggleTheme: () => void;
    onSave: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    headerActions?: React.ReactNode;
}

export const MainLayout = ({ sidebar, canvas, properties, isDarkMode, toggleTheme, onSave, onUndo, onRedo, headerActions }: MainLayoutProps) => {
    return (
        <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans">
            {/* 1. Header / Toolbar */}
            <header className="h-14 border-b border-border flex items-center px-4 justify-between bg-card z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="font-semibold text-lg tracking-tight flex items-center gap-2">
                        <span className="text-primary">PolyScan</span>
                        <span className="text-muted-foreground font-normal">Application Settings Editor</span>
                    </div>
                    <div className="h-6 w-px bg-border mx-2" />
                    <div className="flex items-center gap-1">
                        <button onClick={onUndo} className="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Undo (Ctrl+Z)">
                            <RotateCcw size={18} />
                        </button>
                        <button onClick={onRedo} className="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Redo (Ctrl+Shift+Z)">
                            <RotateCw size={18} />
                        </button>
                        <div className="h-4 w-px bg-border mx-1" />
                        <button className="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors" title="Grid View">
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {headerActions}
                    <div className="h-6 w-px bg-border mx-2" />
                    <button className="h-9 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium transition-colors flex items-center gap-2">
                        <Play size={16} />
                        Preview
                    </button>
                    <button onClick={onSave} className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                        <Save size={16} />
                        Save
                    </button>
                </div>
            </header>

            {/* 2. Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar (Left) - Contains Library & Properties */}
                <aside className="w-80 border-r border-border bg-card flex flex-col shrink-0">
                    {/* Top: Component Library */}
                    <div className="flex-1 min-h-0 flex flex-col border-b border-border">
                        {sidebar}
                    </div>

                    {/* Bottom: Properties Panel */}
                    <div className="h-1/2 min-h-[300px] flex flex-col">
                        {properties}
                    </div>
                </aside>

                {/* Canvas Area (Center/Right) */}
                <main className="flex-1 bg-muted/30 relative flex flex-col min-w-0">
                    {/* Canvas Container */}
                    <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                        {canvas}
                    </div>
                </main>
            </div>

            {/* 3. Status Bar */}
            <footer className="h-6 border-t border-border bg-muted/50 flex items-center px-4 text-xs text-muted-foreground justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Ready</span>
                    </div>
                    <span>Components: 4/12</span>
                    <span>Coverage: 100%</span>
                </div>
                <div>
                    Valid Layout
                </div>
            </footer>
        </div>
    );
};
