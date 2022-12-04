import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import { FaArrowUp, FaArrowDown, FaPlay, FaPause } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import beep from './house_alarm-clock_loud-92419.mp3';

// Break and session has the same max and min.
const maxTimeLength = 60 * 60 * 1000; // one hour
const minTimeLength = 1 * 60 * 1000; // one minute
const oneMinute = 60 * 1000;
const oneSecond = 1000; // one second in mili second

function App() {
  return (
    <Container className="text-center vh-100 d-flex flex-column justify-content-center align-items-center">
      <Header />
      <PomodoroClock />
      <Footer />
    </Container>
  );
}

function Header() {
  return (
    <Row>
      <header>
        <h1>Pomodoro Clock</h1>
      </header>
    </Row>
  )
}

function Footer() {
  return (
    <Row>
      <footer className="text-center mt-3">
        <p><a className="link-dark" href="https://github.com/SalmandaAK/fcc-javascript-calculator">View Code in GitHub</a></p>
        <p>Sound Effect from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=6402">Pixabay</a></p></footer>
    </Row>
  )
}

function PomodoroClock() {
  const [sessionLength, setSessionLength] = useState(25 * oneMinute);
  const [breakLength, setBreakLength] = useState(1 * oneMinute);
  const [timeLeft, setTimeLeft] = useState(1 * oneMinute);
  const [isPaused, setIsPaused] = useState(true);
  const [isSessionTime, setisSessionTime] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const timeoutIdRef = useRef(null);
  const beepAudioRef = useRef(null);

  function handleReset() {
    setBreakLength(5 * oneMinute);
    setSessionLength(25 * oneMinute);
    setTimeLeft(25 * oneMinute);
    setIsPaused(true);
    setisSessionTime(true);
    beepAudioRef.current.pause();
    beepAudioRef.current.currentTime = 0;
    setIsAudioPlaying(false);
  }
  
  function handleDecreaseBreak() {
    if (breakLength === minTimeLength) {
      return
    }
    if (!isSessionTime) {
      setTimeLeft(breakLength - oneMinute);
    }
    setBreakLength(breakLength - oneMinute);
  }

  function handleIncreaseBreak() {
    if (breakLength === maxTimeLength) {
      return
    }
    if (!isSessionTime) {
      setTimeLeft(breakLength + oneMinute);
    }
    setBreakLength(breakLength + oneMinute);
  }

  function handleDecreaseSession() {
    if (sessionLength === minTimeLength) {
      return
    }
    if (isSessionTime) {
      setTimeLeft(sessionLength - oneMinute);
    }
    setSessionLength(sessionLength - oneMinute);
  }

  function handleIncreaseSession() {
    if (sessionLength === maxTimeLength) {
      return
    }
    if (isSessionTime) {
      setTimeLeft(sessionLength + oneMinute);
    }
    setSessionLength(sessionLength + oneMinute);
  }

  function handleStartPauseToggle() {
    setIsPaused(!isPaused);
  }

  useEffect(() => {
    if (isPaused) {
      return
    }
    if (!isPaused) {
      timeoutIdRef.current = setTimeout(() => {
        if (timeLeft === 0) {
          setIsAudioPlaying(true);
          if (isSessionTime) {
            setTimeLeft(breakLength);
          } else {
            setTimeLeft(sessionLength);
          }
          setisSessionTime(!isSessionTime);
        } else {
          setTimeLeft(timeLeft - oneSecond);
        }
      }, 1000)
    } else {
      clearTimeout(timeoutIdRef.current);
    }
    return () => clearTimeout(timeoutIdRef.current);
  }, [timeLeft, isSessionTime, isPaused, breakLength, sessionLength])
  
  //Play audio beep
  useEffect(() => {
    if (isAudioPlaying) {
      beepAudioRef.current.play();
    }
  }, [isAudioPlaying])

  function handleEndBeep() {
    setIsAudioPlaying(false);
  }

  return (
    <>
      <Row>
        <TimerLengthController labelId="break-label" lengthId="break-length" title={"Break Length"} decreaseButtonId="break-decrement" increaseButtonId="break-increment" timeLength={breakLength} isPaused={isPaused} handleDecrease={handleDecreaseBreak} handleIncrease={handleIncreaseBreak} />
        <TimerLengthController labelId="session-label" lengthId="session-length" title={"Session Length"} decreaseButtonId="session-decrement" increaseButtonId="session-increment" timeLength={sessionLength} isPaused={isPaused} handleDecrease={handleDecreaseSession} handleIncrease={handleIncreaseSession} />
      </Row>
      <Row>
        <AudioPlayer ref={beepAudioRef} src={beep} onEnded={handleEndBeep} />
        <TimerDisplay isSessionTime={isSessionTime} sessionLength={sessionLength} breakLength={breakLength} isPaused={isPaused} timeLeft={timeLeft} />
      </Row>
      <Row>
        <Controller isPaused={isPaused} onStartPauseToggle={handleStartPauseToggle} onReset={handleReset} />
      </Row>
    </>
  )
}

const AudioPlayer = React.forwardRef(({src, onEnded}, ref) => (
  <audio id="beep" ref={ref} onEnded={onEnded}>
      <source src={src} type="audio/mpeg"></source>
  </audio>
))

function TimerLengthController({labelId, lengthId, title, timeLength, decreaseButtonId, increaseButtonId, isPaused, handleDecrease, handleIncrease}) {
  timeLength = timeLength / oneMinute;
  return (
    <Col id={labelId}>
      <Stack gap={2}>
        <p>{title}</p>
        <Stack direction="horizontal" gap={3}>
          <button id={decreaseButtonId} disabled={!isPaused} onClick={handleDecrease}><FaArrowDown /></button>
          <p id={lengthId}>{timeLength}</p>
          <button id={increaseButtonId} disabled={!isPaused} onClick={handleIncrease}><FaArrowUp /></button>
        </Stack>
      </Stack>
    </Col>
  )
}

function TimerDisplay({isSessionTime, timeLeft}) {
  let timeDisplay;
  if (timeLeft === maxTimeLength) {
    timeDisplay = "60:00"
  } else {
    timeDisplay = new Date(timeLeft);
    timeDisplay = timeDisplay.toTimeString().slice(3,8);
  }
  return (
    <Col>
      <Card>
        <p id="timer-label">{isSessionTime ? "Session" : "Break"}</p>
        <p id="time-left">{timeDisplay}</p>
      </Card>
    </Col>
  )
}

function Controller({isPaused, onStartPauseToggle, onReset}) {
  return (
    <Col>
      <Stack direction="horizontal" gap={2}>
        <button id="start_stop" onClick={onStartPauseToggle}>{isPaused ? <FaPlay /> : <FaPause />}</button>
        <button id="reset" onClick={onReset}><VscDebugRestart /></button>
      </Stack>
    </Col>
  )
}

export default App;
