import { oneMinute } from "./constants";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function TimerLengthController({
  labelId,
  lengthId,
  title,
  timeLength,
  decreaseButtonId,
  increaseButtonId,
  isPaused,
  handleDecrease,
  handleIncrease
}) {
  timeLength = timeLength / oneMinute;
  return (
    <Stack
      gap={2}
      id={labelId}>
      <div>{title}</div>
      <Stack direction="horizontal" gap={3}>
        <Button
          variant="outline-light"
          id={decreaseButtonId}
          disabled={!isPaused}
          onClick={handleDecrease}
        >
          <FaArrowDown />
        </Button>
        <div id={lengthId}>{timeLength}</div>
        <Button
          variant="outline-light"
          id={increaseButtonId}
          disabled={!isPaused}
          onClick={handleIncrease}
        >
          <FaArrowUp />
        </Button>
      </Stack>
    </Stack>
  )
}