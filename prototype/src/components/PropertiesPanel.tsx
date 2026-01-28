import { Maximize2, Type, Lock, Move, Hash, Scaling } from 'lucide-react';
import type { LayoutNode } from '../types/layout';

interface PropertiesPanelProps {
    selectedId: string | null;
    layout?: LayoutNode;
    onDelete?: () => void;
}

const findNode = (root: LayoutNode, id: string): LayoutNode | null => {
    if (root.id === id) return root;
    if (root.children) {
        for (const child of root.children) {
            const found = findNode(child, id);
            if (found) return found;
        }
    }
    return null;
}

export const PropertiesPanel = ({ selectedId, layout, onDelete }: PropertiesPanelProps) => {
    const selectedNode = (selectedId && layout) ? findNode(layout, selectedId) : null;

    if (!selectedNode) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10 border-t border-border">
                <Move className="mb-2 opacity-20" size={32} />
                <span className="text-xs font-medium">Select a component to view properties</span>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="h-9 px-4 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Properties</span>
                <button className="text-muted-foreground hover:text-foreground p-1 rounded-sm hover:bg-muted">
                    <Maximize2 size={14} />
                </button>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">

                {/* Section: Identity */}
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Identity</h4>
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Type size={12} /> Component Title
                            </label>
                            <input
                                key={selectedNode.id + '_title'}
                                className="w-full h-8 px-2 rounded border border-border bg-background text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
                                defaultValue={selectedNode.componentType || 'Container'}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Hash size={12} /> Node ID
                            </label>
                            <div className="text-xs font-mono text-muted-foreground bg-muted p-1.5 rounded select-all truncate">
                                {selectedNode.id}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Section: Dimensions */}
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Scaling size={12} /> Size & Constraints
                    </h4>
                    <div className="bg-muted/30 p-3 rounded-md border border-border/50 grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] text-muted-foreground font-medium uppercase">Weight (%)</label>
                            <input
                                key={selectedNode.id + '_weight'}
                                className="w-full h-7 px-2 rounded border border-border bg-background text-xs"
                                defaultValue={Math.round(selectedNode.weight)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-muted-foreground font-medium uppercase">Min W (px)</label>
                            <input className="w-full h-7 px-2 rounded border border-border bg-background text-xs" defaultValue="320" />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Section: Options */}
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Behavior</h4>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none group">
                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" defaultChecked />
                            <span className="group-hover:text-foreground text-muted-foreground">Enable Scrollbars</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none group">
                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
                            <span className="group-hover:text-foreground text-muted-foreground flex items-center gap-1.5"><Lock size={12} /> Lock Aspect Ratio</span>
                        </label>
                    </div>
                </div>

                <div className="flex-1" /> {/* Spacer */}

                {/* Section: Actions */}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                    <button className="w-full h-8 rounded border border-border bg-background hover:bg-accent text-xs font-medium transition-colors">
                        Apply Changes
                    </button>
                    <button
                        onClick={onDelete}
                        className="w-full h-8 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors">
                        Remove Component
                    </button>
                </div>

            </div>
        </div>
    );
};
