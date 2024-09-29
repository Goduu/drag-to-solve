"use client"
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Button } from '@/components/ui/button';
import Xarrow from 'react-xarrows';
import { convertTailwindColorToHex, Link, NodeItem } from './types';
import { Node } from './node/node';
import { DroppableArea } from '../droppable-area';
import { useDetectEsc } from '@/lib/useDetectOuterClickAndEsc';
import { NodeEditor } from './node/node-editor';
import { useLinkHandlers } from './useLinkHandlers';

const GRID_SIZE = 20

const InteractiveStoryGrid: React.FC = () => {
    const screenRef = useRef(null)
    const mousePointerDivRef = useRef<HTMLDivElement | null>(null); // Create a reference to the div
    const { handleDotClick, handleDragEnd, handleRun, handleSaveEdit, handleDoubleClick, setEditingItem, editingItem, items, links, mousePosition, linkStart } = useLinkHandlers()


    return (
        <>
            <div className="w-full h-screen flex flex-col p-4" ref={screenRef}>
                <DndContext
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToWindowEdges]}
                >
                    <DroppableArea>
                        {items.map(item => (
                            <Node
                                key={item.id}
                                item={item}
                                onDoubleClick={() => handleDoubleClick(item)}
                                onDotClick={handleDotClick}
                                type={item.type}
                            />
                        ))}

                        {linkStart && (
                            <>
                                {mousePointerDivRef.current &&
                                    <Xarrow
                                        start={linkStart.node}
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
                        {links.map((link, index) => {
                            return <Xarrow
                                key={index}
                                start={link.startNodeRef}
                                end={link.endNodeRef}
                                color={convertTailwindColorToHex(link.color)}
                                strokeWidth={2}
                                path="smooth"
                                curveness={0.3}
                                labels={link.label}
                            />
                        }
                        )}

                    </DroppableArea>
                </DndContext>
                <Button onClick={handleRun} className="mt-4 mx-auto">Run Story</Button>
            </div>
            <NodeEditor editingItem={editingItem} setEditingItem={setEditingItem} handleSaveEdit={handleSaveEdit} />
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