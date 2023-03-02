import logo from "./logo.svg";
import "./App.css";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { Container } from "@mui/material";
import ControlIcons from "./components/ControlIcons";
import { useRef, useState } from "react";

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  } else {
    return `${mm}:${ss}`;
  }
};

function App() {
  const [playerstate, setPlayerState] = useState({
    playing: true,
    mute: true,
    volume: 0.5,
    playerbackRate: 1.0,
    played: 0,
    seeking: false,
  });
  const [fullscreen, setFullscreen] = useState(false);
  const { playing, mute, volume, playerbackRate, played, seeking } =
    playerstate;
  const playerDivRef = useRef(null);
  const playerRef = useRef(null);

  const currentPlayerTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";
  const movieDuration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";
  const playedTime = format(currentPlayerTime);
  const fullMovieTime = format(movieDuration);
  /**
   * functions
   */
  const handlePlayAndPause = () => {
    setPlayerState({
      ...playerstate,
      playing: !playerstate.playing,
    });
  };

  //function to handle rewinding
  const handleRewind = () => {
    playerRef.current.seekTo(
      playerRef.current.getCurrentTime() - 10,
      "seconds"
    );
  };

  //function to handle fast-forward
  //The major difference between this function and that of rewinding is the addition of 30 seconds to the video's current time.
  const handleFastForward = () => {
    playerRef.current.seekTo(
      playerRef.current.getCurrentTime() + 30,
      "seconds"
    );
  };

  const handlePlayerProgress = (state) => {
    console.log("onProgress", state);
    if (!playerstate.seeking) {
      setPlayerState({ ...playerstate, ...state });
    }
    console.log("afterProgress", state);
  };

  const handlePlayerSeek = (newValue) => {
    setPlayerState({ ...playerstate, played: parseFloat(newValue / 100) });
    playerRef.current.seekTo(parseFloat(newValue / 100));
  };

  const handlePlayerMouseSeekUp = (newValue) => {
    setPlayerState({ ...playerstate, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  };

  const handleMuting = () => {
    setPlayerState({ ...playerstate, mute: !playerstate.mute });
  };

  //function for the `onChange` event
  const handleVolumeChange = (e, newValue) => {
    setPlayerState({
      ...playerstate,
      volume: parseFloat(newValue / 100),
      mute: newValue === 0 ? true : false,
    });
  };

  //function for the `onChangeCommitted` event
  const handleVolumeSeek = (e, newValue) => {
    setPlayerState({
      ...playerstate,
      volume: parseFloat(newValue / 100),
      mute: newValue === 0 ? true : false,
    });
  };

  const handlePlayerRate = (rate) => {
    setPlayerState({ ...playerstate, playerbackRate: rate });
  };

  const handleFullScreenMode = () => {
    screenfull.toggle(playerDivRef.current);
    setFullscreen(!fullscreen);
  };

  return (
    <>
      {/* <header className="header__section">
        <p className="header__text">React Video Player - MUI</p>
      </header> */}
      <Container
        maxWidth="md"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="playerDiv" ref={playerDivRef}>
          <ReactPlayer
            width={"100%"}
            height="100%"
            url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
            playing={playing}
            muted={mute}
            ref={playerRef} //here is the reference
            onProgress={handlePlayerProgress}
            playbackRate={playerbackRate}
          />

          <ControlIcons
            playandpause={handlePlayAndPause}
            playing={playing}
            rewind={handleRewind}
            fastForward={handleFastForward}
            played={played}
            onSeek={handlePlayerSeek}
            onSeekMouseUp={handlePlayerMouseSeekUp}
            playedTime={playedTime}
            fullMovieTime={fullMovieTime}
            muting={handleMuting}
            muted={mute}
            volume={volume}
            volumeChange={handleVolumeChange}
            volumeSeek={handleVolumeSeek}
            playerbackRate={playerbackRate}
            playRate={handlePlayerRate}
            fullScreenMode={handleFullScreenMode}
            fullscreen={fullscreen}
          />
        </div>
      </Container>
    </>
  );
}

export default App;
