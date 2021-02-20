import React, { forwardRef } from "react";
import {
  Typography,
  Grid,
  Button,
  IconButton,
  Slider,
  withStyles,
  Tooltip,
  Popover,
} from "@material-ui/core/";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import FastForwardIcon from "@material-ui/icons/FastForward";
import FastRewindIcon from "@material-ui/icons/FastRewind";

import { makeStyles } from "@material-ui/core/styles";
import "../App.css";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
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
    color: "#777",
    "&:hover": {
      color: "#fff",
    },
  },
  VolumeSlider: {
    width: 100,
  },
});
function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}
const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);
export default forwardRef(
  (
    {
      onPlayPause,
      playing,
      onFastForward,
      onRewind,
      onMute,
      muted,
      onVolumeChange,
      onVolumeSeekUp,
      volume,
      onPlaybackRate,
      playbackRate,
      onToggleFullscreen,
      played,
      onSeek,
      onSeekMouseDown,
      onSeekMouseUp,
      elaspedTime,
      totalDuration,
      onChangeDisplayFormat,
      onBookmark,
    },
    ref
  ) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopover = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "playbackrate-popover" : undefined;
    return (
      <div className={classes.controlsWrapper} ref={ref}>
        {/* top controlls */}
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="space-between"
          style={{ padding: 16 }}
        >
          <Grid item>
            <Typography variant="h5" style={{ color: "#fff" }}>
              Title
            </Typography>
          </Grid>
          <Grid item>
            <Button
              onClick={onBookmark}
              variant="contained"
              color="primary"
              startIcon={<BookmarkIcon />}
            >
              Bookmark
            </Button>
          </Grid>
        </Grid>

        {/* middle controls */}
        <Grid container alignItems="center" justify="center">
          <IconButton
            onClick={onRewind}
            className={classes.controlIcons}
            aria-label="reqind"
          >
            <FastRewindIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={onPlayPause}
            className={classes.controlIcons}
            aria-label="reqind"
          >
            {playing ? (
              <PauseIcon fontSize="inherit"></PauseIcon>
            ) : (
              <PlayArrowIcon fontSize="inherit" />
            )}
          </IconButton>
          <IconButton
            onClick={onFastForward}
            className={classes.controlIcons}
            aria-label="reqind"
          >
            <FastForwardIcon fontSize="inherit" />
          </IconButton>
        </Grid>
        {/*bottom controls  */}
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          style={{ padding: 16 }}
        >
          <Grid item xs={12}>
            <PrettoSlider
              min={0}
              max={100}
              value={played * 100}
              ValueLabelComponent={(props) => (
                <ValueLabelComponent {...props} value={elaspedTime} />
              )}
              onChange={onSeek}
              onMouseDown={onSeekMouseDown}
              onChangeCommitted={onSeekMouseUp}
            />
          </Grid>
          <Grid item>
            <Grid container alignItems="center" direction="row">
              <IconButton onClick={onPlayPause} className={classes.bottomIcons}>
                {playing ? (
                  <PauseIcon fontSize="small" />
                ) : (
                  <PlayArrowIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton onClick={onMute} className={classes.bottomIcons}>
                {muted ? (
                  <VolumeOffIcon fontSize="small" />
                ) : (
                  <VolumeUpIcon fontSize="small" />
                )}
              </IconButton>
              <Slider
                min={0}
                max={100}
                defaultValue={100}
                className={classes.VolumeSlider}
                onChange={onVolumeChange}
                onChangeCommitted={onVolumeSeekUp}
                value={muted ? 0 : volume * 100}
              />
              <Button
                onClick={onChangeDisplayFormat}
                variant="text"
                style={{ color: "#fff", marginLeft: 16 }}
              >
                <Typography>
                  {elaspedTime}/{totalDuration}
                </Typography>
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              onClick={handlePopover}
              variant="text"
              className={classes.bottomIcons}
            >
              <Typography>{playbackRate}x</Typography>
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <Grid container direction="column-reverse">
                {[0.5, 1, 1.5, 2].map((rate, index) => (
                  <Button
                    key={index}
                    onClick={() => onPlaybackRate(rate)}
                    variant="text"
                  >
                    <Typography
                      color={rate === playbackRate ? "secondary" : "black"}
                    >
                      {rate}x
                    </Typography>
                  </Button>
                ))}
              </Grid>
            </Popover>
            <IconButton
              onClick={onToggleFullscreen}
              className={classes.bottomIcons}
            >
              <FullscreenIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    );
  }
);
