import React from 'react';
import '../assets/css/MsgProgramada.css';

function MsgProgramada(props) {
    return (
        <div className={`msg-body-${props.type}`}>
            <h1>aprenda mais rapido</h1>
        </div>
    );
};

export default MsgProgramada;