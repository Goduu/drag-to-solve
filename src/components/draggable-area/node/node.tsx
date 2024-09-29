"use client"
import { MutableRefObject, useCallback } from "react";
import { NodeType, NodeItem } from "../types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { LinkDots } from "./link-dots";
import { cn } from "@/lib/utils";

interface NodeProps {
    item: NodeItem;
    type: NodeType
    onDoubleClick: () => void;
    onDotClick: (node: MutableRefObject<HTMLElement | null>, item: NodeItem) => void;
}

export const Node: React.FC<NodeProps> = ({ item, type, onDoubleClick, onDotClick }) => {
    const { attributes, listeners, setNodeRef, node, transform } = useDraggable({ id: item.id });
    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    const typeClass = getTypeClass(type)

    const handleDotClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onDotClick(node, item);
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