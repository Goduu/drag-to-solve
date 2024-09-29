import React, { FC, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getRandomBgColor, NodeItem, OutputItem } from '../types';
import { Button } from '../../ui/button';
import { Badge } from '@/components/ui/badge';
import { Output } from './output/output';

type NodeEditorProps = {
    editingItem: NodeItem | null
    setEditingItem: (item: NodeItem | null) => void
    handleSaveEdit: (item: NodeItem) => void
}
export const NodeEditor: FC<NodeEditorProps> = ({ editingItem, setEditingItem, handleSaveEdit }) => {

    const handleAddOutput = () => {
        editingItem && setEditingItem({
            ...editingItem,
            outputs: [...editingItem.outputs,
            { label: `Output${editingItem.outputs.length}`, color: getRandomBgColor() }
            ]
        }
        )
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
                <div>
                    Input:
                    {JSON.stringify(editingItem?.input)}
                </div>
                {editingItem?.type === "if" && (
                    <IfNodeContent />
                )}
                <div>
                    Output:
                    {JSON.stringify(editingItem?.outputs)}
                </div>
                <Button variant="outline" onClick={handleAddOutput}> Add Output </Button>
                <div className='flex gap-2 flex-wrap'>
                    {editingItem?.outputs.map(output => (
                        <Output output={output} />
                    ))}
                </div>
                <Textarea
                    value={editingItem?.code}
                    onChange={(e) => editingItem && setEditingItem({ ...editingItem, code: e.target.value })}
                    placeholder="Item Code"
                />
                <Button onClick={() => editingItem && handleSaveEdit(editingItem)}>Save</Button>
            </DialogContent>
        </Dialog>
    )
}


const IfNodeContent = () => {
    const conditionals = ["===", "<=", ">=", "<", ">", "!==", "!"]

    return (
        <div className='flex gap-2 bg-pi-500'>
            {conditionals.map(cond => (
                <Badge variant="outline" className='cursor-pointer'>
                    {cond}
                </Badge>
            ))}
        </div>
    )
}