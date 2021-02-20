import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
} from "@material-ui/core/";
import ReactPlayer from "react-player";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import PlayerControls from "./component/PlayerControls";
import screenfull from "screenfull";
const useStyles = makeStyles({
  playerWrapper: {
    width: "100%",
    position: "relative",
  },
  controlsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1,
  },
  controlIcons: {
    color: "#777",
    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },
  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },
  VolumeSlider: {
    width: 100,
  },
});

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
  }

  return `${mm}:${ss}`;
};
let count = 0;
function App() {
  const classes = useStyles();
  const [state, setState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);
  const { playing, muted, volume, playbackRate, played, seeking } = state;
  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };
  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };
  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };
  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };
  const handleVolumeChange = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };
  const handleVolumeSeekUp = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };
  const handlePlaybackRateChange = (rate) => {
    setState({ ...state, playbackRate: rate });
  };
  const toggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current);
  };
  const handleProgress = (changeState) => {
    if (count > 2) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility === "visible") {
      count++;
    }
    if (!seeking) {
      setState({ ...state, ...changeState });
    }
  };
  const handleSeekChange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };
  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };
  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  };
  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";
  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapsedTime =
    timeDisplayFormat === "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;
  const totalDuration = format(duration);
  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat === "normal" ? "remaining" : "normal"
    );
  };
  const addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      playerRef.current.getInternalPlayer(),
      0,
      0,
      canvas.width,
      canvas.height
    );
    const imageUrl = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;
    setBookmarks([
      ...bookmarks,
      { time: currentTime, display: elapsedTime, image: imageUrl },
    ]);
  };
  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Mash Player</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <div
          onMouseMove={handleMouseMove}
          ref={playerContainerRef}
          className={classes.playerWrapper}
        >
          <ReactPlayer
            ref={playerRef}
            width={"100%"}
            height={"100%"}
            playing={playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            url="https://www.youtube.com/watch?v=t2ypzz6gJm0"
            // config={{
            //   file: {
            //     attributes: {
            //       crossOrigin: "anonymous",
            //     },
            //   },
            // }}
          />

          <PlayerControls
            ref={controlsRef}
            onPlayPause={handlePlayPause}
            playing={playing}
            onRewind={handleRewind}
            onFastForward={handleFastForward}
            muted={muted}
            onMute={handleMute}
            onVolumeChange={handleVolumeChange}
            onVolumeSeekUp={handleVolumeSeekUp}
            volume={volume}
            playbackRate={playbackRate}
            onPlaybackRate={handlePlaybackRateChange}
            onToggleFullscreen={toggleFullScreen}
            played={played}
            onSeek={handleSeekChange}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
            elaspedTime={elapsedTime}
            totalDuration={totalDuration}
            onChangeDisplayFormat={handleChangeDisplayFormat}
            onBookmark={addBookmark}
          />
        </div>

        <Grid container style={{ marginTop: 20 }} spacing={3}>
          {bookmarks.map((bookmark, index) => (
            <Grid item key={index}>
              <Paper onClick={() => playerRef.current.seekTo(bookmark.time)}>
                <img
                  crossOrigin="anonymous"
                  src={bookmark.image}
                  alt="bookmark"
                />
                <Typography>Bookmarks at {bookmark.display}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <canvas ref={canvasRef} />
      </Container>
    </>
  );
}

export default App;
