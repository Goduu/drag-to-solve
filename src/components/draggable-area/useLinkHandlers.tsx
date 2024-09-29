import { MutableRefObject, useEffect, useState } from "react";
import { LinkStart, NodeItem, OutputItem } from "./types";
import { useDetectEsc } from "@/lib/useDetectOuterClickAndEsc";
import { DragEndEvent } from "@dnd-kit/core";

const GRID_SIZE = 20
export const useLinkHandlers = () => {
    const [linkStart, setLinkStart] = useState<LinkStart | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // State for storing position
    const [editingItem, setEditingItem] = useState<NodeItem | null>(null);
    const [items, setItems] = useState<NodeItem[]>([
        { id: '1', name: 'Input', code: '', position: { x: 0, y: 0 }, type: "input", inputs: [], outputs: [] },
        { id: '2', name: 'Process 1', code: '', position: { x: 140, y: 0 }, type: "if", inputs: [], outputs: [] },
        { id: '3', name: 'Output', code: '', position: { x: 420, y: 0 }, type: "output", inputs: [], outputs: [] },
    ]);


    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event; // Get mouse coordinates
            setMousePosition({
                x: clientX - 100,
                y: clientY - 180
            }); // Update position state
        };

        // Add mousemove event listener
        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const findOrCreateNextOutput = (item: NodeItem) => {
        if (!item.nodeRef) {
            throw new Error("NodeRef is not set")
        }

        const nextFreeOutput = item.outputs.find(output => !output.endNodeRef);
        if (!nextFreeOutput) {
            const newOutput: OutputItem = { label: `Output${item.outputs.length}`, color: "bg-red-500", startNodeRef: item.nodeRef, value: null }
            setItems(items.map(i => i.id === item.id ? { ...i, outputs: [...i.outputs, newOutput] } : i));
            return newOutput
        }

        return nextFreeOutput
    }

    const handleDotClick = (node: MutableRefObject<HTMLElement | null>, item: NodeItem) => {
        if (!linkStart) {
            setLinkStart({ node, output: findOrCreateNextOutput(item) });
        } else {
            if (linkStart.node !== node) {
                setItems(items.map(item =>
                    item.id === item.id ?
                        {
                            ...item,
                            outputs: item.outputs.map(
                                output => output === linkStart.output ?
                                    { ...output, endNodeRef: node }
                                    : output)
                        }
                        : item));
            }
            setLinkStart(null);
        }
    };

    useDetectEsc(() => setLinkStart(null));

    // ITEM STATES;:

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
    };

    const handleDoubleClick = (item: NodeItem) => {
        setEditingItem(item);
    };

    const handleSaveEdit = (editedItem: NodeItem) => {
        setItems(items.map(item => item.id === editedItem.id ? editedItem : item));
        setEditingItem(null);
    };

    const setNodeRef = (item: NodeItem, node: MutableRefObject<HTMLElement | null>) => {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, nodeRef: node } : i));
    }

    const handleRun = async () => {
    };

    return {
        linkStart,
        mousePosition,
        setNodeRef,
        handleDotClick,
        handleDragEnd,
        handleDoubleClick,
        handleSaveEdit,
        handleRun,
        items,
        editingItem,
        setItems,
        setEditingItem
    }

}