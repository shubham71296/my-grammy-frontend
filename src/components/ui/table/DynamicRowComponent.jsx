import React from 'react'

function DynamicRowComponent({ val, i2, headCells }) {
    if (headCells[i2].hasOwnProperty("_comp")) {
        const Comp = headCells[i2]._comp;
        return <Comp val={val} />
    } else {
        return <>{val}</>
    }
}

export default DynamicRowComponent;
