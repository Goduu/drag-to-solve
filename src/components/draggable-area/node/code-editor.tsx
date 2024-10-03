import React, { useRef } from 'react';
import { InputItem, OutputItem } from '../types';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    inputs?: InputItem[];
    outputs?: OutputItem[];
}


const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, inputs, outputs }) => {
    const textRef = useRef<HTMLTextAreaElement>(null);
    const addBadge = (variable: string) => {
        setCode(`${code}${variable} `);
        textRef.current?.focus();
    }

    const inputsAndOutputs = [...inputs || [], ...outputs || []]

    return (
        <div className="p-4 border rounded-lg">
            <div className='min-h-20'>
                <p className="font-bold mb-2">Variables:</p>
                <div className="mb-4 gap-2 flex flex-wrap">
                    {inputsAndOutputs.map((variable) => (
                        <Badge key={variable.label} variant="outline" onClick={() => addBadge(variable.label)} className={`cursor-pointer ${variable.color}`}>
                            {variable.label}
                        </Badge>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Code:</h3>
                <Textarea
                    ref={textRef}
                    contentEditable
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full min-h-[200px] p-2 border rounded font-mono whitespace-pre-wrap"
                    style={{ outline: 'none' }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;