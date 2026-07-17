import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import Player from "@vimeo/player";
import Logo from "./images/Apophenia_LogoA_White.png";

export default function App() {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);
  const [cursor, setCursor] = useState({ x: -200, y: -200 });

  useEffect(() => {
    // Initialise once. (Avoid destroying on cleanup: the iframe is owned by
    // React, and Player.destroy() would remove it — which breaks StrictMode's
    // double-invoke in dev.)
    if (playerRef.current) return;
    const player = new Player(iframeRef.current);
    playerRef.current = player;
    // Keep muted until the visitor opts in (required for autoplay).
    player.setMuted(true);
  }, []);

  const enableSound = () => {
    if (soundOn) return;
    const player = playerRef.current;
    if (player) {
      player.setMuted(false);
      player.setVolume(1);
      player.play().catch(() => {});
    }
    setSoundOn(true);
  };

  const handleMove = (e) => setCursor({ x: e.clientX, y: e.clientY });

  const handleLogoClick = (e) => {
    e.stopPropagation();
    window.location.href = "mailto:info@apophenia.eu";
  };

  return (
    <div className={`app ${soundOn ? "sound-on" : ""}`}>
      <div className="vimeo-wrapper">
        <iframe
          ref={iframeRef}
          title="Microbial Menage"
          src="https://player.vimeo.com/video/801803036?h=74ea60f1d7&badge=0&autoplay=1&loop=1&muted=1&byline=0&title=0&controls=0"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      </div>

      <div className="logo">
        <img
          src={Logo}
          className="logo"
          alt="ALogo"
          onClick={handleLogoClick}
        />
      </div>

      <div className="variable-logo">
        <p>A</p>
      </div>

      {/* Transparent layer above the Vimeo iframe: catches the first click to
          enable sound and lets the hint follow the cursor over the video.
          Removed once sound is on, so the logo/video become interactive. */}
      {!soundOn && (
        <div
          className="sound-overlay"
          onClick={enableSound}
          onMouseMove={handleMove}
        >
          <div
            className="cursor-hint"
            style={{ left: cursor.x, top: cursor.y }}
          >
            Click for sound
          </div>
          <div className="tap-hint">Tap for sound</div>
        </div>
      )}
    </div>
  );
}
