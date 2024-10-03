import { MutableRefObject, useEffect, useState } from "react";
import { getRandomBgColor, LinkStart, NodeItem, OutputItem, VariableItem } from "./types";
import { useDetectEsc } from "@/lib/useDetectOuterClickAndEsc";
import { DragEndEvent } from "@dnd-kit/core";

const GRID_SIZE = 20
export const useLinkHandlers = () => {
    const [linkStart, setLinkStart] = useState<LinkStart | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // State for storing position
    const [editingItem, setEditingItem] = useState<NodeItem | null>(null);
    const [variableEditingItem, setVariableEditingItem] = useState<VariableItem | null>(null)
    const [nodes, setNodes] = useState<NodeItem[]>([
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
            const newOutput: OutputItem = { id: `var${Math.random() * 100}`, label: `var${item.outputs.length}`, color: getRandomBgColor(), startNodeRef: item.nodeRef, value: null }
            setNodes(nodes.map(i => i.id === item.id ? { ...i, outputs: [...i.outputs, newOutput] } : i));
            return newOutput
        }

        return nextFreeOutput
    }

    const handleSetVariable = (variableEditing: VariableItem) => {
        variableEditing &&
            setNodes(prev => {
                return prev.map(node => ({
                    ...node,
                    inputs: node.inputs.map(input => input.id === variableEditing.id ? { ...input, label: variableEditing.label } : input),
                    outputs: node.outputs.map(output => output.id === variableEditing.id ? { ...output, label: variableEditing.label } : output)
                }))
            })
        setVariableEditingItem(null)
    }

    const handleDotClick = (node: NodeItem) => {
        if (!node.nodeRef) throw new Error("ERROR: nodeRef not set")

        if (!linkStart) {
            setLinkStart({ node, output: findOrCreateNextOutput(node) });
        } else {
            if (linkStart.node.nodeRef !== node.nodeRef) {
                setNodes(nodes.map(currentNode =>
                    currentNode.id === linkStart.node.id ?
                        {
                            ...currentNode,
                            outputs: currentNode.outputs.map(
                                output => output === linkStart.output ?
                                    { ...output, endNodeRef: node.nodeRef, label: output.label }
                                    : output)
                        }
                        :
                        currentNode.id === node.id ? {
                            ...currentNode,
                            inputs: [
                                ...currentNode.inputs,
                                {
                                    id: linkStart.output.id,
                                    value: null,
                                    label: linkStart.output.label,
                                    color: getRandomBgColor(),
                                    outputReferenceNode: linkStart.node
                                }]
                        }
                            : currentNode));
            }
            setLinkStart(null);
        }
    };

    useDetectEsc(() => setLinkStart(null));

    // ITEM STATES;:

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setNodes(prevNodes =>
            prevNodes.map(item => {
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
        setNodes(nodes.map(item => item.id === editedItem.id ? editedItem : item));
        setEditingItem(null);
    };

    const setNodeRef = (item: NodeItem, node: MutableRefObject<HTMLElement | null>) => {
        setNodes(prev => prev.map(i => i.id === item.id ? { ...i, nodeRef: node } : i));
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
        variableEditingItem,
        setVariableEditingItem,
        handleSetVariable,
        items: nodes,
        editingItem,
        setItems: setNodes,
        setEditingItem
    }

}