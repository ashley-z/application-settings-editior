export type NodeType = 'row' | 'col' | 'component';

export interface LayoutNode {
    id: string;
    type: NodeType;
    parentId: string | null;
    children?: LayoutNode[]; // Optional for components
    weight: number; // Percentage or flex weight (e.g., 50 for 50%)
    componentType?: string; // For 'component' nodes (e.g., 'camera', 'trace')
    componentId?: string; // Instance ID
    componentColor?: string; // Hex color for background
    props?: Record<string, any>;
}

export type DraggedItem = {
    type: 'new-component';
    componentType: string;
    label: string;
}
