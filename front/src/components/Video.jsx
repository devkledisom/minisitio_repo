import React, { useState } from 'react';

const styleVideo = {
    marginTop: "20px",
    padding: "10px"
}

function Video(props) {

    //const [] = useState(null);

    console.log(props.link)
    return (
        <div className='video-player'>
            {
                (props.link != '' && props.link != null) &&
                <div class="bg-cinza hidden-xs" style={styleVideo}>
                    <iframe width="100%" height="350" src={`https://www.youtube.com/embed/${props.link.slice(32)}?rel=0&controls=0&showinfo=0`} frameborder="0" allowfullscreen=""></iframe>
                </div>
            }
        </div>
    )
}

export default Video;