import React, { useRef } from 'react';
import type { LayoutNode } from '../types/layout';
import { Splitter } from './Splitter';
import { resizeNode } from '../logic/layoutManager';
import { cn } from '../lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { Camera, Activity, Sliders } from 'lucide-react';
import { CameraComponent } from './CameraComponent';
import { AppSpec } from './AppSpec';
import { Traces } from './Traces';
import { LightSource } from './LightSource';
import type { AppSpecSettings } from './Sidebar';

// Mock Initial State (Recursive)
// Mock Initial State (Recursive)
interface CanvasProps {
    layout: LayoutNode;
    setLayout: React.Dispatch<React.SetStateAction<LayoutNode>>;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    dragPreview?: {
        targetId: string;
        direction: 'horizontal' | 'vertical';
        insertBefore: boolean;
    } | null;
    appSpecSettings: AppSpecSettings;
    sectionOrder: string[];
}

export const Canvas = ({ layout, setLayout, selectedId, onSelect, dragPreview, appSpecSettings, sectionOrder }: CanvasProps) => {
    // We need refs to measure containers for pixel-to-percent conversion
    const containerRef = useRef<HTMLDivElement>(null);

    const onResize = (node: LayoutNode, index: number, delta: number) => {
        const element = document.getElementById(`node-${node.id}`);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const isVertical = node.type === 'row'; // flex-col (Vertical Stack)
        const size = isVertical ? rect.height : rect.width;

        const deltaPercent = (delta / size) * 100;

        setLayout(prev => resizeNode(prev, node.id, index, deltaPercent));
    };

    const renderNode = (node: LayoutNode) => {
        if (node.type === 'component') {
            return <ComponentCell node={node} key={node.id} selectedId={selectedId} onSelect={onSelect} dragPreview={dragPreview} appSpecSettings={appSpecSettings} sectionOrder={sectionOrder} />;
        }

        const isVertical = node.type === 'row';
        const children = node.children || [];

        return (
            <div
                id={`node-${node.id}`}
                className={cn("flex flex-1 min-h-0 min-w-0 h-full w-full", isVertical ? "flex-col" : "flex-row")}
                key={node.id}
            >
                {children.map((child, index) => (
                    <React.Fragment key={child.id}>
                        <div style={{ flex: `${child.weight} 1 0%` }} className="flex min-h-0 min-w-0 overflow-hidden relative">
                            {renderNode(child)}
                        </div>

                        {/* Insert Splitter */}
                        {index < children.length - 1 && (
                            <Splitter
                                type={isVertical ? 'row' : 'col'} // Splitter type matches direction. row-resize for vertical stack?
                                // If flex-col (vertical stack), we want a horizontal separator that drags Y. -> type='row' in Splitter.
                                // If flex-row, we want vertical separator that drags X. -> type='col'.
                                onResize={(delta) => onResize(node, index, delta)}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-background border border-border rounded-lg shadow-sm relative overflow-hidden flex flex-col">
            {/* Top Status Bar (Optional) */}
            <div className="bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground border-b flex justify-between">
                <span>1920 x 1080 (100%)</span>
                <span>Root: Grid</span>
            </div>

            <div className="flex-1 flex overflow-hidden p-1 relative" ref={containerRef}>
                {renderNode(layout)}
            </div>
        </div>
    );
};

interface ComponentCellProps {
    node: LayoutNode;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    dragPreview?: {
        targetId: string;
        direction: 'horizontal' | 'vertical';
        insertBefore: boolean;
        isReplace?: boolean;
    } | null;
    appSpecSettings: AppSpecSettings;
    sectionOrder: string[];
}

const ComponentCell = ({ node, selectedId, onSelect, dragPreview, appSpecSettings, sectionOrder }: ComponentCellProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: node.id,
        data: node
    });

    const isEmpty = !node.componentType;
    const isSelected = selectedId === node.id;

    // Ghost Preview Logic
    const isTarget = dragPreview?.targetId === node.id;
    const previewStyle: React.CSSProperties = {};

    if (isTarget && dragPreview) {
        const { direction, insertBefore, isReplace } = dragPreview;
        // 'horizontal' -> Columns. defined by Left/Right overlay.
        // 'vertical' -> Rows. defined by Top/Bottom overlay.

        if (isReplace) {
            previewStyle.width = '100%';
            previewStyle.height = '100%';
            previewStyle.top = 0;
            previewStyle.left = 0;
        } else if (direction === 'horizontal') {
            previewStyle.width = '50%';
            previewStyle.height = '100%';
            previewStyle.top = 0;
            previewStyle.left = insertBefore ? 0 : '50%';
        } else {
            previewStyle.width = '100%';
            previewStyle.height = '50%';
            previewStyle.left = 0;
            previewStyle.top = insertBefore ? 0 : '50%';
        }
    }

    return (
        <div
            ref={setNodeRef}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(node.id);
            }}
            className={cn(
                "flex-1 m-0.5 rounded shadow-sm flex flex-col min-h-0 min-w-0 relative group transition-colors cursor-pointer",
                isEmpty ? "bg-muted/10 border-2 border-dashed border-muted-foreground/10" : "bg-card border border-border",
                isOver && !dragPreview && "ring-2 ring-primary ring-inset bg-accent", // Fallback if no preview
                isSelected && "ring-2 ring-primary border-transparent"
            )}
            style={!isEmpty && node.componentColor ? { backgroundColor: node.componentColor } : {}}
            id={`cell-${node.id}`}
        >
            {/* Ghost Overlay */}
            {isTarget && (
                <div
                    className="absolute bg-primary/20 border-2 border-primary z-20 pointer-events-none transition-all duration-75 ease-out rounded-sm"
                    style={previewStyle}
                />
            )}

            {!isEmpty && (
                <>
                    <div className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-medium border shadow-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {node.componentType?.includes('Camera') ? <Camera size={12} /> :
                            node.componentType?.includes('Trace') ? <Activity size={12} /> :
                                <Sliders size={12} />}
                        {node.componentType}
                    </div>
                    <div className="flex-1 w-full h-full overflow-hidden relative">
                        {/* Mock Content based on Type */}
                        {node.componentType?.includes('Camera') ? (
                            <CameraComponent id={node.id} />
                        ) : node.componentType?.includes('Trace') ? (
                            <Traces id={node.id} />
                        ) : node.componentType?.includes('LED') ? (
                            <LightSource id={node.id} name={node.componentType || 'LED'} />
                        ) : (
                            <AppSpec id={node.id} appSpecSettings={appSpecSettings} sectionOrder={sectionOrder} />
                        )}
                    </div>
                </>
            )}
            {isEmpty && (
                <div className="flex-1 flex items-center justify-center text-muted-foreground/10 text-sm font-medium select-none pointer-events-none">
                    Drop Component Here
                </div>
            )}
        </div>
    )
}
