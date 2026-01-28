import type { LayoutNode } from '../types/layout';

export const resizeNode = (
    root: LayoutNode,
    parentId: string,
    index: number, // Index of the left/top child
    deltaPercent: number
): LayoutNode => {
    if (root.id === parentId) {
        // Ensure children exists
        const newChildren = root.children ? [...root.children] : [];
        if (newChildren.length === 0) return root;

        const leftChild = newChildren[index];
        const rightChild = newChildren[index + 1];

        if (!leftChild || !rightChild) return root;

        // Constrain weights
        let newLeftWeight = leftChild.weight + deltaPercent;
        let newRightWeight = rightChild.weight - deltaPercent;

        // Simple constraint: min 10%
        if (newLeftWeight < 10) {
            newRightWeight += (newLeftWeight - 10);
            newLeftWeight = 10;
        }
        if (newRightWeight < 10) {
            newLeftWeight += (newRightWeight - 10);
            newRightWeight = 10;
        }

        newChildren[index] = { ...leftChild, weight: newLeftWeight };
        newChildren[index + 1] = { ...rightChild, weight: newRightWeight };

        return { ...root, children: newChildren };
    }

    // Recursive search
    if (root.children && root.children.length > 0) {
        return {
            ...root,
            children: root.children.map(child => resizeNode(child, parentId, index, deltaPercent))
        };
    }

    return root;
};

const COMPONENT_COLORS = [
    '#e0f2fe', // sky-100
    '#dbeafe', // blue-100
    '#f0f9ff', // sky-50
    '#eff6ff', // blue-50
    '#eefff5', // green-ish
    '#fdf2f8', // pink-50
    '#f5f3ff', // violet-50
    '#fff7ed', // orange-50
];

const getRandomColor = () => COMPONENT_COLORS[Math.floor(Math.random() * COMPONENT_COLORS.length)];

export const splitNode = (
    root: LayoutNode,
    targetId: string,
    direction: 'horizontal' | 'vertical',
    newComponentType: string,
    insertBefore: boolean = false
): LayoutNode => {
    // 0. If root (or target) is empty (has no componentType and no children), just fill it
    if (root.id === targetId && !root.componentType && (!root.children || root.children.length === 0)) {
        return {
            ...root,
            componentType: newComponentType,
            componentColor: getRandomColor()
        };
    }

    // 1. If we are at the target node, replace it with a container
    if (root.id === targetId) {
        // Create new container
        const containerId = `split-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNodeId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 'horizontal' split means items are side-by-side -> 'col' (flex-row)
        // 'vertical' split means items are stacked -> 'row' (flex-col)
        const containerType = direction === 'horizontal' ? 'col' : 'row';

        const newComponent: LayoutNode = {
            id: newNodeId,
            type: 'component',
            parentId: containerId,
            weight: 50,
            componentType: newComponentType,
            componentColor: getRandomColor()
        };

        const originalNode: LayoutNode = {
            ...root,
            id: root.id,
            parentId: containerId,
            weight: 50
        };

        const children = insertBefore
            ? [newComponent, originalNode]
            : [originalNode, newComponent];

        const container: LayoutNode = {
            id: containerId,
            type: containerType,
            parentId: root.parentId,
            weight: root.weight,
            children: children
        };

        return container;
    }

    // 2. Recursive search
    if (root.children && root.children.length > 0) {
        return {
            ...root,
            children: root.children.map(child => splitNode(child, targetId, direction, newComponentType, insertBefore))
        };
    }

    return root;
};

// Helper to check if a node is effectively empty (recursive)
const isEmptyNode = (node: LayoutNode): boolean => {
    if (node.type === 'component') {
        return !node.componentType;
    }
    if (node.children) {
        return node.children.length === 0 || node.children.every(isEmptyNode);
    }
    return true;
};

export const deleteNode = (root: LayoutNode, targetId: string): LayoutNode | null => {
    if (root.id === targetId) return null; // Root deleted? Handle in App

    if (root.children) {
        // Find index of child to delete
        const index = root.children.findIndex(child => child.id === targetId || findNodeInTree(child, targetId));

        if (index === -1) return root; // Not in this branch

        // If direct child
        if (root.children[index].id === targetId) {
            const deletedWeight = root.children[index].weight;
            const newChildren = root.children.filter(c => c.id !== targetId);

            // Redistribute weight to remaining children
            if (newChildren.length > 0) {
                const weightToAdd = deletedWeight / newChildren.length;
                newChildren.forEach(c => c.weight += weightToAdd);
            }

            // Collapse logic:
            // If NO children remain -> this container is now empty. Return null? 
            // Or better: Let the APP handle the top-level empty check. 
            // But deep in tree, if a container becomes empty or has only 1 child, we might want to simplify.

            if (newChildren.length === 0) {
                // Container is empty. 
                // We should probably return a "placeholder" empty component instead of an empty container?
                // Or just let it be an empty container?
                // User wants "blank canvas" -> "only one cell".
                // So if it's the root container and has 0 kids, App should reset.
                // If it's a nested container and has 0 kids, it should die.
                return null; // Signal to parent that this node is gone
            }

            // If 1 child remains, promote it? (Optional, but cleaner)
            if (newChildren.length === 1) {
                const onlyChild = newChildren[0];
                // Adopt grand-child's properties but keep current weight/ID? 
                // Or just return the child (with updated weight/parent)? 
                // Returning the child replaces 'root' (the container) with 'child'.
                return {
                    ...onlyChild,
                    parentId: root.parentId,
                    weight: root.weight // Keep the container's weight in its parent
                };
            }

            return { ...root, children: newChildren };
        }

        // Recursive call
        const newChildren = root.children.map(child => {
            const result = deleteNode(child, targetId);
            return result;
        }).filter((n): n is LayoutNode => n !== null); // Remove nulls (deleted nodes)

        // If children changed, we might need to rebalance weights or collapse
        if (newChildren.length !== root.children.length) {
            // Rebalance weights if needed logic is complicated here because we don't know WHICH one died exactly 
            // (unless we track it).
            // But wait, the recursive call returns a *replaced* node. 
            // If we returned 'null' from the recursive call (meaning child died), 
            // we filter it out. 
            // So we need to redistribute weight of the *missing* child.

            // Simpler approach: normalize weights of remaining children to sum to 100?
            // Or sum previous weights and scale?
            // Since we use flex-basis (weight), normalizing to 100 is safe if we assume full fill.
            const totalWeight = newChildren.reduce((sum, c) => sum + c.weight, 0);
            if (totalWeight > 0 && totalWeight < 99) { // minimal tolerance
                const scale = 100 / totalWeight;
                newChildren.forEach(c => c.weight *= scale);
            }
        }

        if (newChildren.length === 0) {
            return null; // Container became empty
        }

        if (newChildren.length === 1) {
            // Promote single child
            return {
                ...newChildren[0],
                parentId: root.parentId,
                weight: root.weight
            };
        }

        return {
            ...root,
            children: newChildren
        };
    }

    return root;
};

// Helper
const findNodeInTree = (root: LayoutNode, id: string): boolean => {
    if (root.id === id) return true;
    if (root.children) return root.children.some(c => findNodeInTree(c, id));
    return false;
};

// Helper: Get all used component types
export const getUsedComponentTypes = (root: LayoutNode): Set<string> => {
    const types = new Set<string>();
    const traverse = (node: LayoutNode) => {
        if (node.componentType) {
            types.add(node.componentType);
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    };
    traverse(root);
    return types;
};
