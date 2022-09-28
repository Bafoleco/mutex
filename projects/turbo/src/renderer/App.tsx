import * as React from 'react';
import Container from 'react-bootstrap/esm/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import './types';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import QRCode from 'qrcode';
import { REMOTE_URL } from '../constants';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';

type AppProps = {
};

export const setClipboard = (text: string) => {
  var type = "text/plain";
  var blob = new Blob([text], { type });
  var data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data);
}

const displayHealth = (timeSinceMount: number, timeSinceHeartbeat: number): JSX.Element => {

  // console.log("displaying health");
  // console.log(timeSinceMount);
  // console.log(timeSinceHeartbeat);

  const style: React.CSSProperties = { fontSize: '0.8em', margin: '0', textAlign: 'center' };

  if (!timeSinceHeartbeat && timeSinceMount < 60.5) {
    return (
      <Alert variant="warning" style={style}>
        Waiting for connection...
      </Alert>
    );
  }

  if (timeSinceHeartbeat && timeSinceHeartbeat <= 60) {
    return (
      <Alert variant="success" style={style}>
        {/* {`Connection confirmed ${Math.round(timeSinceHeartbeat)}s ago`} */}
        Connected
      </Alert>
    );
  } else {
    return (
      <Alert variant="danger" style={style}>
        {`No connection in the last minute`}
      </Alert>
    );
  }
}

const displayId = (id: string, idDataUrl: string): JSX.Element => {
  return (
    <Card>
      <Card.Body>
        <Stack gap={1}>
          <Button variant="outline-primary" onClick={() => setClipboard(`${REMOTE_URL}/remote/${id}`)}> Copy Remote Link </Button>
          <img src={idDataUrl}></img>
        </Stack>
      </Card.Body>
    </Card>
  )
}

const showPairingButton = (showId: boolean, setShowId: (showId: boolean) => void): JSX.Element => {
  if (showId) {
    return (
      <Button variant="outline-primary" onClick={() => setShowId(false)}> Hide Pairing Info</Button>
    )
  } else {
    return <Button variant="outline-primary" onClick={() => setShowId(true)}> Show Pairing Info</Button>;
  }
}

const App = (props: AppProps): JSX.Element => {
  const [timeSinceMount, setTimeSinceMount] = React.useState(0);
  const [timeSinceHeartbeat, setTimeSinceHeartbeat] = React.useState(undefined);

  const [idDataUrl, setIdDataUrl] = React.useState(undefined);
  const [id, setId] = React.useState(undefined);
  const [showId, setShowId] = React.useState(false);

  // console.log("rendering app");

  React.useEffect(() => {
    console.log("setting up interval");
    const interval = setInterval(() => {
      setTimeSinceMount(timeSinceMount => timeSinceMount + 1);
      setTimeSinceHeartbeat((timeSinceHeartbeat: number | undefined) => {
        if (timeSinceHeartbeat !== undefined) {
          return timeSinceHeartbeat + 1;
        } else {
          return undefined;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleHeartbeat = (event: Event, message: any): void => {
    // console.log("received heartbeat");
    setTimeSinceHeartbeat(0);
    QRCode.toDataURL(`${REMOTE_URL}/remote/${message.id}`, (err: Error, url: string) => {
      setId(message.id);
      setIdDataUrl(url);
    });
  }

  const handleId = (event: Event, message: any): void => {
    console.log("received id");
    setId(message.id);
  }

  React.useEffect(() => {
    window.electronAPI.setHeartbeatHandler(handleHeartbeat);
    window.electronAPI.setIdHandler(handleId);
    console.log("request id");
    window.electronAPI.requestId();
  }, []);

  return (
    <Container fluid>
      <p></p>
      <Stack style={{ width: '90%', margin: 'auto' }} gap={1}>
        <h5>
          {displayHealth(timeSinceMount, timeSinceHeartbeat)}
        </h5>
        {id && showPairingButton(showId, setShowId)}
        {showId && id && displayId(id, idDataUrl)}
      </Stack>
    </Container>
  )
}

export default App;