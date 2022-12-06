import React from "react";

const AudioPlayer = React.forwardRef(({ src }, ref) => (
    <audio id="beep" ref={ref}>
        <source src={src} type="audio/mpeg"></source>
    </audio>
))

export default AudioPlayer;