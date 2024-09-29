import { useDroppable } from "@dnd-kit/core";
import { FC, ReactNode } from "react";

export const DroppableArea: FC<{ children: ReactNode }> = ({ children }) => {
    const { setNodeRef } = useDroppable({ id: 'droppable' });

    return (
        <div ref={setNodeRef} className="w-screen h-screen relative">
            {children}
        </div>
    );
};