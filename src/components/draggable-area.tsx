"use client"
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import Xarrow from 'react-xarrows';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface StoryItem {
    id: string;
    name: string;
    code: string;
    position: { x: number; y: number };
}

interface Link {
    start: MutableRefObject<HTMLElement | null>;
    end: MutableRefObject<HTMLElement | null>;
}

interface DraggableItemProps {
    item: StoryItem;
    onDoubleClick: () => void;
    onDotClick: (node: MutableRefObject<HTMLElement | null>, position: 'top' | 'right' | 'bottom' | 'left') => void;
}

const GRID_SIZE = 20;

const DraggableItem: React.FC<DraggableItemProps> = ({ item, onDoubleClick, onDotClick }) => {
    const { attributes, listeners, setNodeRef, node, transform } = useDraggable({ id: item.id });
    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    const handleDotClick = useCallback((e: React.MouseEvent, position: 'top' | 'right' | 'bottom' | 'left') => {
        e.stopPropagation();
        onDotClick(node, position);
    }, [item.id, onDotClick]);

    return (
        <div
            ref={(el) => { setNodeRef(el); }}
            style={{
                ...style,
                position: 'absolute',
                top: item.position.y,
                left: item.position.x,
            }}
            {...attributes}
            className=" border border-gray-300 rounded-lg flex items-center justify-center relative group"
            onDoubleClick={onDoubleClick}
        >
            <div {...listeners} className="w-full h-full flex items-center justify-center cursor-move p-10">
                <span>{item.name}</span>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 w-10 h-3 rounded-full cursor-pointer z-10 pointer-events-auto"
                    onClick={(e) => handleDotClick(e, 'top')}
                ></div>
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-500 w-10 h-3 rounded-full cursor-pointer z-10 pointer-events-auto"
                    onClick={(e) => handleDotClick(e, 'bottom')}
                ></div>
                <div
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 w-3 h-10 rounded-full cursor-pointer z-10 pointer-events-auto"
                    onClick={(e) => handleDotClick(e, 'left')}
                ></div>
                <div
                    className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-500 w-3 h-10 rounded-full cursor-pointer z-10 pointer-events-auto"
                    onClick={(e) => handleDotClick(e, 'right')}
                ></div>
            </div>
        </div>
    );
};

const DroppableArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setNodeRef } = useDroppable({ id: 'droppable' });
    return (
        <div ref={setNodeRef} className="w-screen h-screen relative">
            {children}
        </div>
    );
};

interface MousePosition {
    x: number;
    y: number;
}

const InteractiveStoryGrid: React.FC = () => {
    const [items, setItems] = useState<StoryItem[]>([
        { id: '1laxgon1l', name: 'Start', code: '', position: { x: 0, y: 0 } },
        { id: '2laxgon2l', name: 'Process 1', code: '', position: { x: 140, y: 0 } },
        { id: '3laxgon3l', name: 'Process 2', code: '', position: { x: 280, y: 0 } },
        { id: '4laxgon4l', name: 'Result', code: '', position: { x: 420, y: 0 } },
    ]);
    const [editingItem, setEditingItem] = useState<StoryItem | null>(null);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [links, setLinks] = useState<Link[]>([]);
    const [linkStart, setLinkStart] = useState<{ node: MutableRefObject<HTMLElement | null>; position: 'top' | 'right' | 'bottom' | 'left' } | null>(null);
    const [output, setOutput] = useState<string>('');
    const divRef = useRef<HTMLDivElement | null>(null); // Create a reference to the div
    const [position, setPosition] = useState({ x: 0, y: 0 }); // State for storing position


    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event; // Get mouse coordinates
            setPosition({ x: clientX, y: clientY }); // Update position state
        };

        // Add mousemove event listener
        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.id === active.id) {
                    return {
                        ...item,
                        position: {
                            x: Math.round((item.position.x + delta.x) / GRID_SIZE) * GRID_SIZE,
                            y: Math.round((item.position.y + delta.y) / GRID_SIZE) * GRID_SIZE,
                        },
                    };
                }
                return item;
            })
        );
        setActiveId(null);
    };

    const handleDoubleClick = (item: StoryItem) => {
        setEditingItem(item);
    };

    const handleSaveEdit = (editedItem: StoryItem) => {
        setItems(items.map(item => item.id === editedItem.id ? editedItem : item));
        setEditingItem(null);
    };

    const handleDotClick = (node: MutableRefObject<HTMLElement | null> | null, position: 'top' | 'right' | 'bottom' | 'left') => {
        if (!node) return
        if (!linkStart) {
            setLinkStart({ node, position });
        } else {
            if (linkStart.node !== node) {
                setLinks([...links, { start: linkStart.node, end: node }]);
            }
            setLinkStart(null);
        }
    };

    const executeCode = (code: string, input: any) => {
        try {
            const func = new Function('input', `return (${code})`);
            return func()(input);
        } catch (error) {
            console.error('Error executing code:', error);
            return input;
        }
    };

    const handleRun = async () => {
        let result = null;
        const startItem = items.find(item => item.name === 'Start');
        if (!startItem) {
            setOutput('Error: No Start item found');
            return;
        }

        result = executeCode(startItem.code, null);

        const processedItems = new Set([startItem.id]);
        let currentItemId = startItem.id;

        // while (true) {
        //     const nextLink = links.find(link => link.start === currentItemId);
        //     if (!nextLink) break;

        //     const nextItem = items.find(item => item.id === nextLink.end);
        //     if (!nextItem || processedItems.has(nextItem.id)) break;

        //     result = executeCode(nextItem.code, result);
        //     processedItems.add(nextItem.id);
        //     currentItemId = nextItem.id;
        // }

        setOutput(`Result: ${result}`);
    };

    return (
        <>
            <div
                ref={divRef}
                style={{ left: position.x, "top": position.y }}
                className='pointer-events-none w-1 absolute h-1 rounded-lg'
            />
            <div className="w-full h-screen flex flex-col p-4">
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToWindowEdges]}
                >
                    <DroppableArea>
                        {items.map(item => (
                            <DraggableItem
                                key={item.id}
                                item={item}
                                onDoubleClick={() => handleDoubleClick(item)}
                                onDotClick={handleDotClick}
                            />
                        ))}

                        {linkStart && divRef.current && (
                            <Xarrow
                                start={linkStart.node} // Use the stored ref
                                end={divRef}     // Use the stored ref
                                color="rgba(0, 0, 255, 0.5)"
                                strokeWidth={2}
                                path="smooth"
                                curveness={0.3}
                            />
                        )}
                        {links.map((link, index) => {
                            return <Xarrow
                                key={index}
                                start={link.start} // Use the stored ref
                                end={link.end}     // Use the stored ref
                                color="rgba(0, 0, 255, 0.5)"
                                strokeWidth={2}
                                path="smooth"
                                curveness={0.3}
                            />
                        }
                        )}
                    </DroppableArea>
                </DndContext>
                <Button onClick={handleRun} className="mt-4 mx-auto">Run Story</Button>
                <div className="mt-4 p-2 rounded">
                    <p>{output}</p>
                </div>
                {editingItem && (
                    <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Item</DialogTitle>
                                <DialogDescription>Edit the name and code for this item.</DialogDescription>
                            </DialogHeader>
                            <Input
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                placeholder="Item Name"
                            />
                            <Textarea
                                value={editingItem.code}
                                onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                                placeholder="Item Code"
                            />
                            <Button onClick={() => handleSaveEdit(editingItem)}>Save</Button>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>

    );
};

export default InteractiveStoryGrid;
