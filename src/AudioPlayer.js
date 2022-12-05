import React from "react";

const AudioPlayer = React.forwardRef(({ src, onEnded }, ref) => (
    <audio id="beep" ref={ref} onEnded={onEnded}>
        <source src={src} type="audio/mpeg"></source>
    </audio>
))

export default AudioPlayer;