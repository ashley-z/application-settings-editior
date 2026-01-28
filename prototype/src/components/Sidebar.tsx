import { useDraggable } from '@dnd-kit/core';
import { Camera, Activity, Lightbulb, RotateCcw, Search, Sliders } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
    usedTypes: string[];
    onReset: () => void;
}

export const Sidebar = ({
    usedTypes = [],
    onReset,
}: SidebarProps) => {
    const [search, setSearch] = useState('');

    const components = [
        { id: 'camera', label: 'Camera', type: 'Camera', icon: Camera, desc: 'Device Feed' },
        { id: 'traces', label: 'Traces', type: 'Traces', icon: Activity, desc: 'Signal Graph' },
        { id: 'led405', label: '405nm LED', type: '405nm LED', icon: Lightbulb, desc: 'Light Source' },
        { id: 'led470', label: '470nm LED', type: '470nm LED', icon: Lightbulb, desc: 'Light Source' },
        { id: 'led560', label: '560nm LED', type: '560nm LED', icon: Lightbulb, desc: 'Light Source' },
        { id: 'app-spec', label: 'Application Specific Settings', type: 'Application Specific Settings', icon: Sliders, desc: 'Fiber Photometry Settings' },

    ];

    const filteredComponents = components.filter(c =>
        c.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full border-r border-border bg-card flex flex-col h-full shrink-0">
            {/* Header */}
            <div className="p-3 border-b border-border space-y-3">
                <button
                    onClick={onReset}
                    className="w-full py-1.5 px-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                    <RotateCcw size={14} />
                    Reset Canvas
                </button>

                <div className="space-y-2">
                    <h2 className="text-sm font-semibold">Component Library</h2>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                            className="w-full bg-muted/50 border border-input rounded-md py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-6">



                {/* Devices Section */}
                <div className="space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Devices</div>
                    <div className="space-y-2">
                        {filteredComponents.filter(c => c.id !== 'app-spec').map((comp) => (
                            <DraggableItem
                                key={comp.id}
                                component={comp}
                                disabled={usedTypes.includes(comp.label)}
                            />
                        ))}
                    </div>
                </div>

                {/* Application Settings Section */}
                <div className="space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Application Specific Settings</div>
                    <div className="space-y-2">
                        {filteredComponents.filter(c => c.id === 'app-spec').map((comp) => (
                            <DraggableItem
                                key={comp.id}
                                component={comp}
                                disabled={usedTypes.includes(comp.label)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

/* Draggable Item Component */
const DraggableItem = ({ component, disabled }: { component: any, disabled?: boolean }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `lib-${component.id}`,
        data: {
            label: component.type,
            type: component.type
        },
        disabled: disabled
    });

    const Icon = component.icon;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                flex items-center gap-3 p-3 rounded border border-border transition-all select-none
                ${disabled
                    ? 'opacity-50 cursor-not-allowed bg-muted/50'
                    : 'bg-white shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md'
                }
                ${isDragging ? 'opacity-50 ring-2 ring-primary' : ''}
            `}
        >
            <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${disabled ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                <Icon size={16} />
            </div>
            <div className="flex flex-col min-w-0">
                <span className={`text-sm font-medium truncate ${disabled ? 'text-muted-foreground' : 'text-slate-800'}`}>{component.label}</span>
                <span className="text-[10px] text-slate-500 truncate">{component.desc}</span>
            </div>
        </div>
    );
};
