// app/api/parse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Parser from 'web-tree-sitter';

let parserPromise: Promise<Parser> | null = null;

async function initializeParser() {
    if (!parserPromise) {
        console.log('1')
        parserPromise = (async () => {
            console.log('2')
            await Parser.init({
                locateFile(scriptName: string, scriptDirectory: string) {
                    return scriptName;
                },
            });
            console.log('3')
            const parser = new Parser();
            console.log('4')
            // const languageWasm = await fetch('/tree-sitter-javascript.wasm').then(r => r.arrayBuffer());
            // const JavaScript = await Parser.Language.load(languageWasm);
            // parser.setLanguage(JavaScript);
            const Lang = await Parser.Language.load('tree-sitter-javascript.wasm');
            console.log('5')
            parser.setLanguage(Lang);
            console.log('6')
            return parser;
        })();
    }
    return parserPromise;
}

export async function POST(request: NextRequest) {
    console.log('in post' )
    try {
        const parser = await initializeParser();
        const { code } = await request.json();
        console.log('code', code)
        
        const tree = parser.parse(code);
        console.log('tree', tree)
        const ast = serializeAST(tree.rootNode);

        return NextResponse.json({ ast });
    } catch (error) {
        console.error('Error parsing code:', error);
        return NextResponse.json({ error: 'Error parsing code', details: error.message }, { status: 500 });
    }
}

function serializeAST(node: any): any {
    const serialized: any = {
        type: node.type,
        startPosition: node.startPosition,
        endPosition: node.endPosition,
        childCount: node.childCount,
    };

    if (node.childCount > 0) {
        serialized.children = [];
        for (let i = 0; i < node.childCount; i++) {
            serialized.children.push(serializeAST(node.child(i)));
        }
    }

    return serialized;
}