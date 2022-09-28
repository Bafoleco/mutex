import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
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
          <img style={{ width: "100%" }} src={idDataUrl}></img>
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

  if (showId) {
    return (
      <Stack gap={1}>
        {showPairingButton(showId, setShowId)}
        {displayId(id, idDataUrl)}
      </Stack>)
  }
  return (
    <Stack>
      {showPairingButton(showId, setShowId)}
    </Stack>
  );
}

export default Pairing;



