
import React from 'react'

export const Xongas = async () => {
    const rootNode = await fetch("http://localhost:3000/api/parse")
    console.log('nodeR', await rootNode.json())
    return (
        <div>xongas</div>
    )
}
