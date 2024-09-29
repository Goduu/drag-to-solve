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

    const handleAddOutput = () => {
        editingItem?.nodeRef && setEditingItem({
            ...editingItem,
            outputs: [...editingItem.outputs,
            { label: `output${editingItem.outputs.length}`, color: getRandomBgColor(), startNodeRef: editingItem.nodeRef, value: null }
            ]
        }
        )
    }

    const handleAddInput = () => {
        editingItem?.nodeRef && setEditingItem(prev => (
            prev ? {
                ...prev,
                inputs: [
                    ...prev.inputs,
                    { label: `input${editingItem.inputs.length}`, color: getRandomBgColor(), value: null }
                ]
            } : prev
        ))
    }

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
                    {editingItem?.inputs.map(input => (
                        <InputBadge input={input} />
                    ))}
                    <Badge variant="outline" className="cursor-pointer" onClick={handleAddInput}> Add Input </Badge>
                </div>

                <div className='flex gap-2 flex-wrap'>
                    {editingItem?.outputs.map(output => (
                        <OutputBadge output={output} />
                    ))}
                    <Badge variant="outline" className="cursor-pointer" onClick={handleAddOutput}> Add Output </Badge>
                </div>
                <CodeEditor inputs={editingItem?.inputs} outputs={editingItem?.outputs} code={editingItem?.code || ""} setCode={handleSetCode} />
                <Button onClick={() => editingItem && handleSaveEdit(editingItem)}>Save</Button>
            </DialogContent>
        </Dialog>
    )
}
