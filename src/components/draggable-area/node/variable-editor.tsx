import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { VariableItem } from '../types';
import { Button } from '../../ui/button';

type VariableEditorProps = {
    editingVariable: VariableItem | null
    setEditingItem: Dispatch<SetStateAction<VariableItem | null>>
    handleSaveEdit: (item: VariableItem) => void
}
export const VariableEditor: FC<VariableEditorProps> = ({ editingVariable, setEditingItem, handleSaveEdit }) => {
    const [variableItem, setVariableItem] = useState<VariableItem | null>(null)

    useEffect(() => {
        setVariableItem(editingVariable)
    }, [editingVariable])

    return (
        <Dialog open={!!editingVariable} onOpenChange={() => setEditingItem(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Variable</DialogTitle>
                    <DialogDescription>Edit the name variable name.</DialogDescription>
                </DialogHeader>
                <Input
                    value={variableItem?.label}
                    onChange={(e) => variableItem && setVariableItem({ ...variableItem, label: e.target.value })}
                    placeholder="Variable Name"
                />
                <Button onClick={() => variableItem && variableItem?.label !== "" && handleSaveEdit(variableItem)}>Save</Button>
            </DialogContent>
        </Dialog>
    )
}
