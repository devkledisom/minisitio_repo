import React, { useState } from 'react';

function Tooltip(props) {
    const [isVisible, setIsvisible] = useState(false);
    //console.log(props.text)
    return (
        <div className='tooltip-custom-container'
            onMouseEnter={() => setIsvisible(true)}
            onMouseLeave={() => setIsvisible(false)}>

            {props.children}
            {isVisible && <div className="tooltip-custom">{props.text}</div>}

        </div>
    )
};

export default Tooltip;