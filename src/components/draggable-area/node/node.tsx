"use client"
import { MutableRefObject, useCallback, useEffect } from "react";
import { NodeType, NodeItem } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { LinkDots } from "./link-dots";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

interface NodeProps {
    item: NodeItem;
    type: NodeType
    setNodeReference: (item: NodeItem, node: MutableRefObject<HTMLElement | null>) => void
    onDoubleClick: () => void;
    onDotClick: (node: NodeItem) => void;
}

export const Node: React.FC<NodeProps> = ({ item, type, setNodeReference, onDoubleClick, onDotClick }) => {
    const { attributes, listeners, setNodeRef, node, transform } = useDraggable({
        id: item.id,
    });

    useEffect(() => {
        if (!item.nodeRef) {
            setNodeReference(item, node);
        }
    }, [node]);

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    const typeClass = getTypeClass(type)

    const handleDotClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onDotClick(item);
    }, [item.id, onDotClick]);

    return (
        <div
            ref={(el) => { setNodeRef(el); }}
            style={{
                ...style,
                top: item.position.y,
                left: item.position.x,
            }}
            {...attributes}
            className={cn(typeClass, "border absolute border-gray-300 flex items-center justify-center group")}
            onDoubleClick={onDoubleClick}
        >
            <div {...listeners} className="w-full h-full flex items-center justify-center cursor-move p-10">
                <span>{item.name}</span>
            </div>
            <LinkDots onDotClick={handleDotClick} />
        </div>
    );
};

const getTypeClass = (type: NodeType) => {

    if (type === "input" || type === "output") {
        return "rounded-full"
    }

    return "rounded-lg"

}