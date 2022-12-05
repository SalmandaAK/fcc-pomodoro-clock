import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { FaPlay, FaPause } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";

export default function Controller({ isPaused, onStartPauseToggle, onReset }) {
  return (
    <Stack className="mx-auto" direction="horizontal" gap={3}>
      <Button 
        variant={isPaused ? "outline-success" : "warning"}
        id="start_stop"
        onClick={onStartPauseToggle}
      >
        {isPaused ? <FaPlay /> : <FaPause />}
      </Button>
      <Button
        variant="outline-danger"
        id="reset"
        onClick={onReset}
      >
        <VscDebugRestart />
      </Button>
    </Stack>
  )
}