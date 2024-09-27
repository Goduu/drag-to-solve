"use client"
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, UniqueIdentifier, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from './ui/button';
import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers';
import Xarrow from 'react-xarrows';


interface StoryItem {
    id: string;
    name: string;
    code: string;
    position: { x: number; y: number };
}

interface Link {
    start: string;
    end: string;
}

interface DraggableItemProps {
    item: StoryItem;
    onDoubleClick: () => void;
    onDotClick: (itemId: string, position: 'top' | 'right' | 'bottom' | 'left') => void;
}

const GRID_SIZE = 20;

const DraggableItem: React.FC<DraggableItemProps> = ({ item, onDoubleClick, onDotClick }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                position: 'absolute',
                top: item.position.y,
                left: item.position.x,
                width: '120px',
                height: '120px',
            }}
            {...listeners}
            {...attributes}
            className="bg-white border border-gray-300 rounded-lg flex items-center justify-center cursor-move relative group"
            onDoubleClick={onDoubleClick}
        >
            <span>{item.name}</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 w-3 h-3 rounded-full cursor-pointer"
                    onClick={() => onDotClick(item.id, 'top')}
                >.</div>
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-500 w-3 h-3 rounded-full cursor-pointer"
                    onClick={() => onDotClick(item.id, 'bottom')}
                >.</div>
                <div
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 w-3 h-3 rounded-full cursor-pointer"
                    onClick={() => onDotClick(item.id, 'left')}
                >.</div>
                <div
                    className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-500 w-3 h-3 rounded-full cursor-pointer"
                    onClick={() => onDotClick(item.id, 'right')}
                >.</div>
            </div>
        </div>
    );
};

const DroppableArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setNodeRef } = useDroppable({ id: 'droppable' });
    return (
        <div ref={setNodeRef} className="w-screen h-screen relative bg-gray-100 ">
            {children}
        </div>
    );
};

const InteractiveStoryGrid: React.FC = () => {
    const [items, setItems] = useState<StoryItem[]>([
        { id: '1', name: 'Start', code: '', position: { x: 0, y: 0 } },
        { id: '2', name: 'Process 1', code: '', position: { x: 140, y: 0 } },
        { id: '3', name: 'Process 2', code: '', position: { x: 280, y: 0 } },
        { id: '4', name: 'Result', code: '', position: { x: 420, y: 0 } },
    ]);
    const [editingItem, setEditingItem] = useState<StoryItem | null>(null);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [links, setLinks] = useState<Link[]>([]);
    const [linkStart, setLinkStart] = useState<{ id: string; position: 'top' | 'right' | 'bottom' | 'left' } | null>(null);


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

    const handleRun = async () => {
        console.log('Running the story...');
    };

    const handleDotClick = (itemId: string, position: 'top' | 'right' | 'bottom' | 'left') => {
        console.log('paha')
        if (!linkStart) {
            setLinkStart({ id: itemId, position });
        } else {
            if (linkStart.id !== itemId) {
                setLinks([...links, { start: linkStart.id, end: itemId }]);
            }
            setLinkStart(null);
        }
    };

    return (
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
                    {links.map((link, index) => (
                        <Xarrow
                            key={index}
                            start={link.start}
                            end={link.end}
                            color="rgba(0, 0, 255, 0.5)"
                            strokeWidth={2}
                            path="smooth"
                            curveness={0.3}
                        />
                    ))}
                </DroppableArea>
            </DndContext>
            <Button onClick={handleRun} className="mt-4 mx-auto">Run Story</Button>

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
    );
};

export default InteractiveStoryGrid;