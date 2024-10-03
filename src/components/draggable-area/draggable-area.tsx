"use client"
import React, { useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Button } from '@/components/ui/button';
import Xarrow from 'react-xarrows';
import { convertTailwindColorToHex } from './types';
import { Node } from './node/node';
import { DroppableArea } from '../droppable-area';
import { NodeEditor } from './node/node-editor';
import { useLinkHandlers } from './useLinkHandlers';
import { VariableEditor } from './node/variable-editor';

const InteractiveStoryGrid: React.FC = () => {
    const screenRef = useRef(null)
    const mousePointerDivRef = useRef<HTMLDivElement | null>(null); // Create a reference to the div
    const { handleDotClick,
        handleDragEnd,
        setVariableEditingItem,
        variableEditingItem,
        handleSetVariable,
        handleSaveEdit,
        handleDoubleClick,
        setEditingItem,
        editingItem,
        items,
        mousePosition,
        linkStart, setNodeRef } = useLinkHandlers()

    return (
        <>
            <div className="w-full h-screen flex flex-col p-4" ref={screenRef}>
                <DndContext
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToWindowEdges]}
                >
                    <DroppableArea>
                        {items.map(item => (
                            <>
                                <Node
                                    key={item.id}
                                    item={item}
                                    onDoubleClick={() => handleDoubleClick(item)}
                                    onDotClick={handleDotClick}
                                    setNodeReference={setNodeRef}
                                    type={item.type}
                                />
                                {item.outputs.map((output, index) => (
                                    output.endNodeRef &&
                                    <Xarrow
                                        key={index}
                                        start={output.startNodeRef}
                                        end={output.endNodeRef}
                                        color={convertTailwindColorToHex(output.color)}
                                        strokeWidth={2}
                                        path="smooth"
                                        curveness={0.3}
                                        labels={
                                            <div onClick={() => {
                                                console.log('setting', { id: output.id, label: output.label })
                                                setVariableEditingItem({ id: output.id, label: output.label })
                                            }} className='cursor-pointer'>
                                                {output.label}
                                            </div>
                                        } />
                                ))
                                }
                            </>
                        ))}

                        {linkStart?.node.nodeRef && (
                            <>
                                {mousePointerDivRef.current &&
                                    <Xarrow
                                        start={linkStart.node.nodeRef}
                                        end={mousePointerDivRef}
                                        color={convertTailwindColorToHex(linkStart.output.color)}
                                        strokeWidth={2}
                                        path="smooth"
                                        curveness={0.3}
                                        labels={linkStart.output.label}

                                    />
                                }
                                <div
                                    ref={mousePointerDivRef}
                                    style={{ left: mousePosition.x, "top": mousePosition.y }}
                                    className='pointer-events-none w-1 absolute h-1 rounded-lg'
                                />
                            </>
                        )}
                    </DroppableArea>
                </DndContext>
                <Button onClick={() => console.log('items', items)} className="mt-4 mx-auto">Run Story</Button>
            </div>
            <NodeEditor editingItem={editingItem} setEditingItem={setEditingItem} handleSaveEdit={handleSaveEdit} />
            <VariableEditor editingVariable={variableEditingItem} setEditingItem={setVariableEditingItem} handleSaveEdit={handleSetVariable} />
        </>

    );
};

export default InteractiveStoryGrid;




// const executeCode = (code: string, input: any) => {
//     try {
//         const func = new Function('input', `return (${code})`);
//         return func()(input);
//     } catch (error) {
//         console.error('Error executing code:', error);
//         return input;
//     }
// };
// const handleRun = async () => {
//     let result = null;
//     const startItem = items.find(item => item.name === 'Start');
//     if (!startItem) {
//         setOutput('Error: No Start item found');
//         return;
//     }

//     result = executeCode(startItem.code, null);

//     const processedItems = new Set([startItem.id]);
//     let currentItemId = startItem.id;

//     // while (true) {
//     //     const nextLink = links.find(link => link.start === currentItemId);
//     //     if (!nextLink) break;

//     //     const nextItem = items.find(item => item.id === nextLink.end);
//     //     if (!nextItem || processedItems.has(nextItem.id)) break;

//     //     result = executeCode(nextItem.code, result);
//     //     processedItems.add(nextItem.id);
//     //     currentItemId = nextItem.id;
//     // }

//     setOutput(`Result: ${result}`);
// };