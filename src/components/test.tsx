"use client"
import { addEdge, Background, Controls, MiniMap, OnConnect, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import React, { useCallback } from 'react'
import type { Node, NodeTypes, BuiltInNode } from "@xyflow/react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Edge, EdgeTypes } from "@xyflow/react";
import TreeSitterFlowDiagram from './testParser';
import { Xongas } from './xongas';

export const initialEdges = [
    { id: "a->c", source: "a", target: "c", animated: true },
    { id: "b->d", source: "b", target: "d" },
    { id: "c->d", source: "c", target: "d", animated: true },
] satisfies Edge[];

export const edgeTypes = {
    // Add your custom edge types here!
} satisfies EdgeTypes;

export type PositionLoggerNode = Node<
    {
        label?: string;
    },
    "position-logger"
>;

export type AppNode = BuiltInNode | PositionLoggerNode;

export const initialNodes: AppNode[] = [
    {
        id: "a", type: "input", position: { x: 0, y: 0 }, data: { label: "wire" }, className: "text-slate-500"
    },
    {
        id: "b",
        type: "position-logger",
        position: { x: -100, y: 100 },
        data: { label: "drag me!" },
        className: "text-slate-500"
    },
    {
        id: "c", position: { x: 100, y: 100 }, data: { label: "your ideas" }, className: "text-slate-500"
    },
    {
        id: "d",
        type: "output",
        position: { x: 0, y: 200 },
        data: { label: "with React Flow" },
        className: "text-slate-500"

    },
];

export const nodeTypes = {
    "position-logger": PositionLoggerNode,
    // Add any of your custom nodes here!
} satisfies NodeTypes;

const code = "const a = 'paha' "

export const Test = () => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    );



    return (
        <>
            <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                edges={edges}
                edgeTypes={edgeTypes}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <MiniMap />
                <Controls />
            </ReactFlow>
        </>
    );
}




export function PositionLoggerNode({
    positionAbsoluteX,
    positionAbsoluteY,
    data,
}: NodeProps<PositionLoggerNode>) {
    const x = `${Math.round(positionAbsoluteX)}px`;
    const y = `${Math.round(positionAbsoluteY)}px`;

    return (
        <div className="react-flow__node-default">
            {data.label && <div>{data.label}</div>}

            <div>
                {x} {y}
            </div>

            <Handle type="source" position={Position.Bottom} />
        </div>

    );
}
