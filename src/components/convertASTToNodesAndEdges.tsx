import { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Parser from "web-tree-sitter"

interface ASTNode extends Parser.SyntaxNode {
    children: ASTNode[];
}

interface ConversionResult {
    nodes: Node[];
    edges: Edge[];
}

export function convertASTToNodesAndEdges(ast: Parser.Tree): ConversionResult {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let nodeId = 0;

    const traverseAST = (node: ASTNode, parentId: string | null = null, x = 0, y = 0): void => {
        const currentId = `node-${nodeId++}`;
        newNodes.push({
            id: currentId,
            position: { x: x * 200, y: y * 100 },
            data: { label: node.type },
            style: { border: '1px solid #777', padding: 10 }
        });

        if (parentId) {
            newEdges.push({
                id: `edge-${parentId}-${currentId}`,
                source: parentId,
                target: currentId,
                type: 'smoothstep'
            });
        }

        if (node.children && node.children.length > 0) {
            node.children.forEach((child: ASTNode, index: number) => {
                traverseAST(child, currentId, x + index + 1, y + 1);
            });
        }
    };

    traverseAST(ast.rootNode);

    return { nodes: newNodes, edges: newEdges };
}