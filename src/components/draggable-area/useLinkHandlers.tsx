import { MutableRefObject, useEffect, useState } from "react";
import { Link, LinkStart, NodeItem, OutputItem } from "./types";
import { useDetectEsc } from "@/lib/useDetectOuterClickAndEsc";
import { DragEndEvent } from "@dnd-kit/core";

const GRID_SIZE = 20
export const useLinkHandlers = () => {
    const [linkStart, setLinkStart] = useState<LinkStart | null>(null);
    const [links, setLinks] = useState<Link[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // State for storing position
    const [editingItem, setEditingItem] = useState<NodeItem | null>(null);
    const [items, setItems] = useState<NodeItem[]>([
        { id: '1laxgon1l', name: 'Input', code: '', position: { x: 0, y: 0 }, type: "input", input: [], outputs: [] },
        { id: '2laxgon2l', name: 'Process 1', code: '', position: { x: 140, y: 0 }, type: "if", input: [], outputs: [] },
        { id: '4laxgon4l', name: 'Output', code: '', position: { x: 420, y: 0 }, type: "output", input: [], outputs: [] },
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

    const findNextFreeOutput = (item: NodeItem) => {
        const nextFreeOutput = item.outputs.find(output => !output.linkedNode);
        if (!nextFreeOutput) {
            const newOutput: OutputItem = { label: `Output${item.outputs.length}`, color: "bg-red-500" }
            setItems(items.map(i => i.id === item.id ? { ...i, outputs: [...i.outputs, newOutput] } : i));
            return newOutput
        }

        return nextFreeOutput
    }

    const handleDotClick = (node: MutableRefObject<HTMLElement | null> | null, item: NodeItem) => {
        if (!node) return
        if (!linkStart) {
            setLinkStart({ node, output: findNextFreeOutput(item) });
        } else {
            if (linkStart.node !== node) {
                setLinks([...links, { startNodeRef: linkStart.node, endNodeRef: node, color: linkStart.output.color, label: linkStart.output.label }]);
                setItems(items.map(item =>
                    item.id === item.id ?
                        {
                            ...item,
                            outputs: item.outputs.map(
                                output => output === linkStart.output ?
                                    { ...output, linkedNode: item }
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



    const handleRun = async () => {
    };

    return {
        links,
        linkStart,
        mousePosition,
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