import React, { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [timerSettings, setTimerSettings] = useState({
    breakLength: 5,
    sessionLength: 25,
    timerType: "session",
    remainingTime: 1500, //60*25min
  });
  const [isActive, setIsActive] = useState(false);

  const toggleIsActive = () => {
    setIsActive(!isActive);
  };
  const audioRef = useRef(null);
  useEffect(() => {
    let interval = null;
    if (isActive) {
      if (timerSettings.remainingTime === 0) {
        beep();
      }
      interval = setInterval(() => {
        if (
          timerSettings.remainingTime === 0 &&
          timerSettings.timerType === "session"
        ) {
          let newRemainingTime = timerSettings.breakLength * 60;
          setTimerSettings({
            ...timerSettings,
            timerType: "break",
            remainingTime: newRemainingTime,
          });
        } else if (
          timerSettings.remainingTime === 0 &&
          timerSettings.timerType === "break"
        ) {
          let newRemainingTime = timerSettings.sessionLength * 60;
          setTimerSettings({
            ...timerSettings,
            timerType: "session",
            remainingTime: newRemainingTime,
          });
        }
        if (timerSettings.remainingTime >= 1) {
          console.log(timerSettings.breakLength);
          setTimerSettings({
            ...timerSettings,
            remainingTime: timerSettings.remainingTime - 1,
          });
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timerSettings.remainingTime]);

  const reset = () => {
    setTimerSettings({
      breakLength: 5,
      sessionLength: 25,
      timerType: "session",
      remainingTime: 1500,
    });
    setIsActive(false);

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const formatTimer = (timer) => {
    let minutes = parseInt(timer / 60, 10)
      .toString()
      .padStart(1, "0");
    let seconds = timer % (60).toString().padStart(1, "0");
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  };

  const increaseSessionLength = () => {
    if (timerSettings.sessionLength < 60) {
      setTimerSettings({
        ...timerSettings,
        sessionLength: timerSettings.sessionLength + 1,
        remainingTime: (timerSettings.sessionLength + 1) * 60,
      });
    }
  };
  const decreaseSessionLength = () => {
    if (timerSettings.sessionLength > 1) {
      setTimerSettings({
        ...timerSettings,
        sessionLength: timerSettings.sessionLength - 1,
        remainingTime: (timerSettings.sessionLength - 1) * 60,
      });
    }
  };

  const decreaseBreakLength = () => {
    if (timerSettings.breakLength > 1) {
      setTimerSettings({
        ...timerSettings,
        breakLength: timerSettings.breakLength - 1,
      });
      console.log(timerSettings.breakLength);
    }
  };

  const increaseBreakLength = () => {
    if (timerSettings.breakLength < 60) {
      setTimerSettings({
        ...timerSettings,
        breakLength: timerSettings.breakLength + 1,
      });
    }
  };

  const beep = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };
  return (
    <div>
      <div className="container">
        <h1>Horloge Pomodoro</h1>

        <p className="subtitle">
          &rdquo; Un outils pour optimiser ses sessions de travail.&rdquo;
        </p>

        <div className="info-container">
          <p>
            Sélectionnez une durée de session et une durée de pause puis lancez
            le chronomètre ci-dessous. Pour en savoir plus sur la technique
            Pomodoro,
            <a
              href="https://fr.wikipedia.org/wiki/Technique_Pomodoro"
              target="_blank"
              rel="noopener noreferrer"
            >
              &nbsp;Cliquez ici.
            </a>
          </p>
        </div>
        <div className="control-panel">
          <div className="control-wrapper bg-blue">
            <h3 id="session-label" className="title">
              Durée de la session
            </h3>
            <div className="control">
              <div className="timer-info">
                <span id="session-length">{timerSettings.sessionLength}</span>
                <span> min</span>
              </div>
              <div className="btn-group">
                <button
                  id="session-increment"
                  onClick={increaseSessionLength}
                  className="btn btn-sign"
                >
                  +
                </button>
                <button
                  id="session-decrement"
                  onClick={decreaseSessionLength}
                  className="btn btn-sign"
                >
                  -
                </button>
              </div>
            </div>
          </div>
          <div id="break-control" className="control-wrapper bg-yellow">
            <h3 id="break-label" className="title">
              Durée de la pause
            </h3>
            <div className="control">
              <div className="timer-info">
                <span id="break-length">{timerSettings.breakLength}</span>
                <span> min</span>
              </div>
              <div className="btn-group">
                <button
                  id="break-increment"
                  onClick={increaseBreakLength}
                  className="btn btn-sign"
                >
                  +
                </button>
                <button
                  id="break-decrement"
                  onClick={decreaseBreakLength}
                  className="btn btn-sign"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="control-panel">
          <div
            className={
              isActive && timerSettings.timerType === "session"
                ? "control-wrapper-active"
                : timerSettings.timerType === "break"
                ? "control-wrapper-break"
                : "control-wrapper bg-red"
            }
          >
            <h3 id="timer-label" className="title">
              {timerSettings.timerType}
            </h3>
            <div className="control">
              <div className="timer-info">
                <span id="time-left">
                  {formatTimer(timerSettings.remainingTime)}
                </span>
                <span> min</span>
              </div>
              <div className="btn-group">
                <button
                  id="start_stop"
                  onClick={toggleIsActive}
                  className="btn btn-start"
                >
                  {isActive ? "running" : "paused"}
                </button>
                <button id="reset" onClick={reset} className="btn btn-start">
                  reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <audio
          id="beep"
          src="./assets/sonnerie.wav"
          // https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"

          preload="auto"
          ref={audioRef}
        ></audio>
      </div>
      <footer>
        <p>Copyright &#169; 2021</p>
      </footer>
    </div>
  );
}

export default App;
