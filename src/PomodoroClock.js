import React, { useRef, useState } from 'react';
import { maxTimeLength, minTimeLength, oneMinute, oneSecond } from './constants'
import beep from './house_alarm-clock_loud-92419.mp3';
import TimerLengthController from './TimerLengthController';
import TimerDisplay from './TimerDisplay';
import AudioPlayer from './AudioPlayer';
import Controller from './Controller';
import Stack from 'react-bootstrap/Stack';

export default function PomodoroClock() {
  const [sessionLength, setSessionLength] = useState(25 * oneMinute);
  const [breakLength, setBreakLength] = useState(5 * oneMinute);
  const [isPaused, setIsPaused] = useState(true);
  const [isSessionTime, setisSessionTime] = useState(true);
  const [secondsPassed, setSecondsPassed] = useState(0);
  const beepAudioRef = useRef(null);
  const intervalRef = useRef(null);

  function handleReset() {
    setBreakLength(5 * oneMinute);
    setSessionLength(25 * oneMinute);
    setIsPaused(true);
    setisSessionTime(true);
    setSecondsPassed(0);
    beepAudioRef.current.pause();
    beepAudioRef.current.currentTime = 0;
    clearInterval(intervalRef.current);
  }

  function handleDecreaseBreak() {
    if (breakLength === minTimeLength) {
      return
    }
    if (!isSessionTime) {
      setSecondsPassed(0);
    }
    setBreakLength(breakLength - oneMinute);
  }

  function handleIncreaseBreak() {
    if (breakLength === maxTimeLength) {
      return
    }
    if (!isSessionTime) {
      setSecondsPassed(0);
    }
    setBreakLength(breakLength + oneMinute);

  }

  function handleDecreaseSession() {
    if (sessionLength === minTimeLength) {
      return
    }
    setSessionLength(sessionLength - oneMinute);
  }

  function handleIncreaseSession() {
    if (sessionLength === maxTimeLength) {
      return
    }
    if (isSessionTime) {
      setSecondsPassed(0);
    }
    setSessionLength(sessionLength + oneMinute);
  }

  function handleStartPauseToggle() {
    if (isPaused) {
      setIsPaused(false);
      // Start count down
      intervalRef.current = setInterval(() => {
        setSecondsPassed(sp => {
          if (isSessionTime && sp === sessionLength) {
            beepAudioRef.current.play();
            setisSessionTime(isSessionTime => !isSessionTime);
            return 0;
          } if (!isSessionTime && sp === breakLength) {
            beepAudioRef.current.play();
            setisSessionTime(isSessionTime => !isSessionTime);
            return 0;
          } else {
            return sp + oneSecond;
          }
        });
      }, oneSecond)
    } else {
      clearInterval(intervalRef.current);
      setIsPaused(true);
    }
  }

  let timeLeft;
  if (isSessionTime) {
    timeLeft = sessionLength;
  } else {
    timeLeft = breakLength;
  }

  timeLeft = timeLeft - secondsPassed;

  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={5}>
        <TimerLengthController
          labelId="break-label"
          lengthId="break-length"
          title={"Break Length"}
          decreaseButtonId="break-decrement"
          increaseButtonId="break-increment"
          timeLength={breakLength}
          isPaused={isPaused}
          handleDecrease={handleDecreaseBreak}
          handleIncrease={handleIncreaseBreak}
        />
        <TimerLengthController
          labelId="session-label"
          lengthId="session-length"
          title={"Session Length"}
          decreaseButtonId="session-decrement"
          increaseButtonId="session-increment"
          timeLength={sessionLength}
          isPaused={isPaused}
          handleDecrease={handleDecreaseSession}
          handleIncrease={handleIncreaseSession}
        />
      </Stack>
      <AudioPlayer
        ref={beepAudioRef}
        src={beep}
      />
      <TimerDisplay
        isSessionTime={isSessionTime}
        sessionLength={sessionLength}
        breakLength={breakLength}
        isPaused={isPaused}
        timeLeft={timeLeft}
      />
      <Controller
        isPaused={isPaused}
        onStartPauseToggle={handleStartPauseToggle}
        onReset={handleReset}
      />
    </Stack>
  )
}