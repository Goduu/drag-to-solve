'use client';

import React, { useState, useEffect } from 'react';
import { ReactFlow, Node, Edge, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Parser from "web-tree-sitter"
import { convertASTToNodesAndEdges } from './convertASTToNodesAndEdges';

interface ASTNode extends Parser.SyntaxNode {
    children: ASTNode[];
}

interface ConversionResult {
    nodes: Node[];
    edges: Edge[];
}

const CodeToDiagramConverter = () => {
    const [code, setCode] = useState('');
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [AST, setAST] = React.useState<Parser.Tree | null>(null)
    const parserRef = React.useRef<Parser>()
    const [isReady, setIsReady] = React.useState(false)


    React.useEffect(() => {
        ; (async () => {
            await Parser.init({
                locateFile(scriptName: string, scriptDirectory: string) {
                    return scriptName
                },
            })

            const parser = new Parser()
            const Lang = await Parser.Language.load("tree-sitter-javascript.wasm")

            setIsReady(true)

            parser.setLanguage(Lang)

            parserRef.current = parser
        })()
    }, [])

    React.useEffect(() => {
        if (!isReady) return
        if (!parserRef.current) return

        const tree = parserRef.current.parse(code)
        console.log("rootNode:", tree.rootNode)
        const { nodes, edges } = convertASTToNodesAndEdges(tree);
        setEdges(edges)
        setNodes(nodes)

        setAST(tree)
    }, [code, isReady])

    // useEffect(() => {
    //     const parseCode = async () => {
    //         try {
    //             const response = await fetch('/api/parse', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ code }),
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Failed to parse code');
    //             }

    //             const { ast } = await response.json();
    //             convertASTToNodesAndEdges(ast);
    //         } catch (error) {
    //             console.error('Error parsing code:', error);
    //             // You might want to show this error to the user
    //         }
    //     };

    //     if (code) {
    //         parseCode();
    //     }
    // }, [code]);





    return (
        <div className="w-full h-screen flex">
            <div className="w-1/2 p-4">
                <textarea
                    className="w-full h-full p-2 border border-gray-300 rounded"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter your JavaScript code here..."
                />
            </div>
            <div className="w-1/2 h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
};

export default CodeToDiagramConverter;