import { MutableRefObject } from "react";

type BgColor = "bg-red-500" | "bg-blue-500" | "bg-green-500" | "bg-yellow-500" | "bg-purple-500" | "bg-pink-500" | "bg-indigo-500"

export function getRandomBgColor(): BgColor {
    const colors: BgColor[] = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500"
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

export const convertTailwindColorToHex = (color: BgColor) => {
    const colorMap: Record<BgColor, string> = {
        "bg-red-500": "#EF4444",
        "bg-blue-500": "#3B82F6",
        "bg-green-500": "#10B981",
        "bg-yellow-500": "#F59E0B",
        "bg-purple-500": "#8B5CF6",
        "bg-pink-500": "#EC4899",
        "bg-indigo-500": "#6366F1"
    }
    return colorMap[color]
}

export interface NodeItem {
    id: string;
    name: string;
    code: string;
    type: NodeType;
    position: { x: number; y: number };
    inputs: InputItem[];
    outputs: OutputItem[];
    nodeRef?: MutableRefObject<HTMLElement | null>;
}

export type VariableItem = {
    id: string,
    label: string
}

export type InputItem = {
    id: string,
    value: any,
    label: string,
    color: BgColor,
    outputReferenceNode: NodeItem
}

export type OutputItem = {
    id: string,
    startNodeRef: MutableRefObject<HTMLElement | null>,
    endNodeRef?: MutableRefObject<HTMLElement | null>,
    value: any,
    label: string,
    color: BgColor,
}

export type LinkStart = {
    node: NodeItem
    output: OutputItem;
}


export interface MousePosition {
    x: number;
    y: number;
}
export type NodeType = "input" | "output" | "if"
const nodeTypes: NodeType[] = ["input", "output", "if"]