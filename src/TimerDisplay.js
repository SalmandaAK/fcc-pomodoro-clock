import { maxTimeLength, oneSecond } from './constants';
import Card from 'react-bootstrap/Card';

export default function TimerDisplay({ isSessionTime, timeLeft, isPaused }) {
  let timeDisplay;
  if (timeLeft === maxTimeLength) {
    timeDisplay = "60:00";
  } else {
    timeDisplay = new Date(timeLeft);
    timeDisplay = timeDisplay.toTimeString().slice(3, 8);
  }

  let timeDisplayClass = "fs-1";
  if (!isPaused && timeLeft <= 10 * oneSecond) {
    timeDisplayClass = timeDisplayClass.concat(" text-danger")
  } else if (!isPaused) {
    timeDisplayClass = timeDisplayClass.concat(" text-warning")
  }
  
  return (
    <Card className="p-3 text-bg-dark border-light">
      <Card.Title id="timer-label" className="fs-2">
        {isSessionTime ? "Session" : "Break"}
      </Card.Title>
      <Card.Body id="time-left" className={timeDisplayClass}>
        {timeDisplay}
      </Card.Body>
    </Card>
  )
}