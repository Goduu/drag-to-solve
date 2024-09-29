import React, { FC, MouseEvent } from 'react'

type LinkDotsProps = {
    onDotClick: (e: MouseEvent<HTMLDivElement>) => void
}

export const LinkDots: FC<LinkDotsProps> = ({ onDotClick }) => {
    return (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100">
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 w-10 h-3 rounded-full cursor-pointer z-10 pointer-events-auto"
                onClick={(e) => onDotClick(e)}
            ></div>
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-500 w-10 h-3 rounded-full cursor-pointer z-10 pointer-events-auto"
                onClick={(e) => onDotClick(e)}
            ></div>
            <div
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 w-3 h-10 rounded-full cursor-pointer z-10 pointer-events-auto"
                onClick={(e) => onDotClick(e)}
            ></div>
            <div
                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-500 w-3 h-10 rounded-full cursor-pointer z-10 pointer-events-auto"
                onClick={(e) => onDotClick(e)}
            ></div>
        </div>
    )
}
