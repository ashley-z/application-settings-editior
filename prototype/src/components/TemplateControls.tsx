import { useState } from 'react';
import { Save, FileText, Trash2, Plus, ChevronDown, FolderOpen } from 'lucide-react';

interface TemplateControlsProps {
    templates: string[];
    onSaveTemplate: (name: string) => void;
    onLoadTemplate: (name: string) => void;
    onDeleteTemplate: (name: string) => void;
}

export const TemplateControls = ({
    templates = [],
    onSaveTemplate,
    onLoadTemplate,
    onDeleteTemplate
}: TemplateControlsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [saveMode, setSaveMode] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');

    const handleSave = () => {
        if (!newTemplateName.trim()) return;
        onSaveTemplate(newTemplateName);
        setNewTemplateName('');
        setSaveMode(false);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 px-3 rounded-md border border-border bg-card hover:bg-accent text-sm font-medium transition-colors flex items-center gap-2 group"
            >
                <FolderOpen size={16} className="text-muted-foreground group-hover:text-foreground" />
                <span>Templates</span>
                <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    {templates.length}
                </div>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setSaveMode(false); }} />
                    <div className="absolute top-full right-0 mt-1 w-64 bg-card border border-border shadow-lg rounded-md p-2 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150 origin-top-right">

                        {/* Header / Actions */}
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Manage Templates</span>
                            <button
                                onClick={() => setSaveMode(!saveMode)}
                                className={`p-1 rounded transition-colors ${saveMode ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
                                title="Save current layout as template"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        {/* Save Input Area */}
                        {saveMode && (
                            <div className="flex gap-1.5 p-1 bg-muted/30 rounded border border-border/50">
                                <input
                                    className="flex-1 bg-background border border-input rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                                    placeholder="New template name..."
                                    value={newTemplateName}
                                    onChange={(e) => setNewTemplateName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                    autoFocus
                                />
                                <button
                                    onClick={handleSave}
                                    className="p-1 px-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                                >
                                    <Save size={14} />
                                </button>
                            </div>
                        )}

                        {/* List */}
                        <div className="max-h-[300px] overflow-y-auto space-y-1">
                            {templates.length === 0 ? (
                                <div className="text-xs text-muted-foreground italic p-4 text-center">No saved templates</div>
                            ) : (
                                templates.map(name => (
                                    <div key={name} className="flex items-center justify-between group px-2 py-1.5 rounded hover:bg-accent cursor-pointer text-sm">
                                        <div className="flex items-center gap-2 overflow-hidden flex-1" onClick={() => { onLoadTemplate(name); setIsOpen(false); }}>
                                            <FileText size={14} className="text-blue-500 shrink-0" />
                                            <span className="truncate">{name}</span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDeleteTemplate(name); }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-all"
                                            title="Delete template"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
