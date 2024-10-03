import React, { Dispatch, FC, SetStateAction } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getRandomBgColor, NodeItem, OutputItem } from '../types';
import { Button } from '../../ui/button';
import { Badge } from '@/components/ui/badge';
import { OutputBadge } from './output-badge';
import { InputBadge } from './input-badge';
import CodeEditor from './code-editor';

type NodeEditorProps = {
    editingItem: NodeItem | null
    setEditingItem: Dispatch<SetStateAction<NodeItem | null>>
    handleSaveEdit: (item: NodeItem) => void
}
export const NodeEditor: FC<NodeEditorProps> = ({ editingItem, setEditingItem, handleSaveEdit }) => {

    const handleSetCode = (code: string) => {
        editingItem && setEditingItem(prev => (prev ? { ...prev, code } : prev))
    }

    return (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Node</DialogTitle>
                    <DialogDescription>Edit the name and code for this node.</DialogDescription>
                </DialogHeader>
                <Input
                    value={editingItem?.name}
                    onChange={(e) => editingItem && setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="Item Name"
                />

                <div className='flex gap-2 flex-wrap'>
                    Inputs:
                    {editingItem?.inputs.map(input => (
                        <InputBadge input={input} />
                    ))}
                </div>

                <div className='flex gap-2 flex-wrap'>
                    Outputs:
                    {editingItem?.outputs.map(output => (
                        <OutputBadge output={output} />
                    ))}
                </div>
                <CodeEditor inputs={editingItem?.inputs} outputs={editingItem?.outputs} code={editingItem?.code || ""} setCode={handleSetCode} />
                <Button onClick={() => editingItem && handleSaveEdit(editingItem)}>Save</Button>
            </DialogContent>
        </Dialog>
    )
}
