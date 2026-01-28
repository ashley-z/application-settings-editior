import { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';

interface SplitterProps {
    type: 'row' | 'col';
    onResize: (delta: number) => void;
}

export const Splitter = ({ type, onResize }: SplitterProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef<number>(0);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        // We prevent default to stop text selection, but that blocks focus.
        // So we must manually focus the element to enable keyboard events.
        (e.currentTarget as HTMLDivElement).focus();
        e.preventDefault();

        setIsDragging(true);
        startPos.current = type === 'row' ? e.clientY : e.clientX;
        document.body.style.cursor = type === 'row' ? 'row-resize' : 'col-resize';
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const currentPos = type === 'row' ? e.clientY : e.clientX;
            const delta = currentPos - startPos.current;
            onResize(delta);
            startPos.current = currentPos; // Incremental updates
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onResize, type]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (type === 'row') {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                onResize(-10);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                onResize(10);
            }
        } else {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                onResize(-10);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                onResize(10);
            }
        }
    };

    return (
        <div
            role="separator"
            aria-orientation={type === 'row' ? 'horizontal' : 'vertical'}
            tabIndex={0}
            className={cn(
                "bg-border hover:bg-primary/50 transition-colors z-10 flex items-center justify-center group touch-none outline-none focus-visible:bg-primary focus-visible:ring-2 focus-visible:ring-primary/50",
                type === 'row' ? "h-1 w-full cursor-row-resize py-0.5" : "w-1 h-full cursor-col-resize px-0.5",
                isDragging && "bg-primary"
            )}
            onMouseDown={handleMouseDown}
            onKeyDown={handleKeyDown}
        >
            {/* Handle Visual */}
            <div className={cn(
                "bg-muted-foreground/0 group-hover:bg-muted-foreground/20 rounded-full transition-colors",
                isDragging && "bg-primary-foreground",
                type === 'row' ? "w-8 h-1" : "h-8 w-1"
            )} />
        </div>
    );
};
