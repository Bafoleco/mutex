import React from 'react';
import { Button, Card, Col, Stack } from 'react-bootstrap';
import QRCode from 'qrcode';
import { REMOTE_URL } from "../../../common/constants";


const setClipboard = (text: string) => {
  var type = "text/plain";
  var blob = new Blob([text], { type });
  var data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data);
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
      <Button variant="outline-primary" onClick={() => setShowId(false)}> Close </Button>
    )
  } else {
    return <Button variant="outline-primary" onClick={() => setShowId(true)}> Pair Phone </Button>;
  }
}


type PairingProps = {
  id: string,
}

const Pairing = (props: PairingProps) => {
  const { id } = props;

  const [showId, setShowId] = React.useState(false);
  const [idDataUrl, setIdDataUrl] = React.useState("");

  React.useEffect(() => {
    QRCode.toDataURL(`${REMOTE_URL}/remote/${id}`, (err, url) => {
      setIdDataUrl(url);
    });
  }, []);

  return (
    <Stack>
      {showPairingButton(showId, setShowId)}
      {showId && displayId(id, idDataUrl)}
    </Stack>
  )
}

export default Pairing;



