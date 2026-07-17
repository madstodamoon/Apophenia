import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import Player from "@vimeo/player";
import Logo from "./images/Apophenia_LogoA_White.png";
import Poster from "./images/poster.jpg";

export default function App() {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);
  const [ready, setReady] = useState(false);
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

    // Reveal (blur -> sharp) once the video is actually painting frames, so
    // Vimeo's black-screen spinner is never seen. Several signals + a safety
    // timeout so we never get stuck hidden.
    const reveal = () => setReady(true);
    const onTime = (data) => {
      if (data && data.seconds > 0) {
        reveal();
        player.off("timeupdate", onTime);
      }
    };
    player.on("timeupdate", onTime);
    player.on("play", reveal);
    setTimeout(reveal, 4000);
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
    <div className={`app ${soundOn ? "sound-on" : ""} ${ready ? "ready" : ""}`}>
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

      {/* Blurred first-frame poster covers Vimeo's loading spinner, then fades
          out as the video sharpens into view. */}
      <img className="poster" src={Poster} alt="" aria-hidden="true" />

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
