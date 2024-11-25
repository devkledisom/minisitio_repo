import React, { useState, useEffect } from 'react';

const styleVideo = {
    marginTop: "20px",
    padding: "10px"
}

function Video(props) {
    const [idVideo, setIdVideo] = useState(null);

    useEffect(() => {
        function extractYouTubeID(url) {
            const regex = /(?:\?v=|&v=|\/embed\/|\/watch\?v=|youtu\.be\/|\/v\/|\/watch\?.*v=)([^&?#]+)/;
            const match = url.match(regex);
            return match ? match[1] : null;
        }
        
        // Define a função para validar se a URL é do YouTube
        function isYouTubeURL(url) {
            return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
        }
        
        // URL do vídeo do YouTube
        const url = "https://www.youtube.com/watch?v=CxY-tOLR9c0&t=23s";
        
        // Verifica se a URL é válida e extrai o ID
        if (isYouTubeURL(url)) {
            const videoID = extractYouTubeID(url);
            setIdVideo(videoID);
            //console.log("ID do vídeo:", videoID); // Saída: CxY-tOLR9c0
        } else {
            //console.error("URL inválida do YouTube");
        }
    });

    return (
        <div className='video-player'>
            {
                (props.link != '' && props.link != null) &&
                <div class="bg-cinza hidden-xs" style={styleVideo}>
                    <iframe width="100%" height="350" src={`https://www.youtube.com/embed/${idVideo}?rel=0&controls=0&showinfo=0`} frameborder="0" allowfullscreen=""></iframe>
                </div>
            }
        </div>
    )
}

export default Video;