import React, { useEffect, useRef, useState } from 'react';
import { maxTimeLength, minTimeLength, oneMinute, oneSecond } from './constants'
import beep from './house_alarm-clock_loud-92419.mp3';
import TimerLengthController from './TimerLengthController';
import TimerDisplay from './TimerDisplay';
import AudioPlayer from './AudioPlayer';
import Controller from './Controller';
import Stack from 'react-bootstrap/Stack';

export default function PomodoroClock() {
  const [sessionLength, setSessionLength] = useState(25 * oneMinute);
  const [breakLength, setBreakLength] = useState(1 * oneMinute);
  const [timeLeft, setTimeLeft] = useState(25 * oneMinute);
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
        onEnded={handleEndBeep}
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