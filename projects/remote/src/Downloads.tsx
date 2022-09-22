import React from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container"
import Stack from "react-bootstrap/esm/Stack";
import UAParser from 'ua-parser-js';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { BACKGROUND_COLOR } from './constants';

const getButton = (os: UAParser.IOS, setDownloaded: React.Dispatch<React.SetStateAction<boolean>>) => {

  const style = { margin: 'auto' };
  const osName = os.name;

  if (osName === 'Ubuntu' || osName === 'Linux' || osName === 'VectorLinux' || osName === 'Unix') {
    const link = "https://github.com/Bafoleco/mutex-turbo/releases/download/v0.1.0/mutex-turbo-0.1.0-x64.dmg";
    return <Button href={link} variant="primary" style={style} onClick={() => {
      setDownloaded(true);
    }}> Download Mutex Turbo for Linux </Button>;

  } else if (osName === 'Mac OS') {
    const link = "https://github.com/Bafoleco/mutex/releases/latest/download/mutex-turbo.dmg";
    return <Button href={link} variant="primary" style={style} onClick={
      () => {
        setDownloaded(true);
      }
    }>  Download Mutex Turbo for Mac </Button>;

  } else if (osName === 'Windows') {
    const link = "https://github.com/Bafoleco/mutex/releases/latest/download/mutex-turbo.exe";
    return <Button href={link} variant="primary" style={style} onClick={
      () => {
        setDownloaded(true);
      }
    }>Download Mutex Turbo for Windows</Button>;

  } else {
    return (
      <p>
        Sorry, your operating system could not be determined. Please download the appropriate version of Mutex Turbo for your operating system here. Email us
        if you have any questions.
      </p>
    );
  }
}

const openMutexTurbo = () => {
  const style = { margin: 'auto' };
  const link = "mutex-turbo://open";
  return <Button href={link} variant="primary" style={style} onClick={() => {
  }}>Open Mutex Turbo</Button>;
}

const Downloads = () => {
  const uaParser = new UAParser(window.navigator.userAgent);
  const [downloaded, setDownloaded] = React.useState(false);

  console.log(uaParser);
  console.log(uaParser.getOS());

  return (
    <Container fluid style={{ backgroundColor: BACKGROUND_COLOR, height: '100%' }}>
      <Stack gap={4}>
        <div style={{ height: "2rem" }}></div>
        <div style={{ margin: 'auto', width: '14rem', height: '14rem' }}>
          <img style={{ width: '100%' }} src="/turbo-icon.svg" alt="turbo icon" />
        </div>
        <h1 style={{ margin: 'auto' }}> Control your streams like never before</h1>

        {!downloaded && getButton(uaParser.getOS(), setDownloaded)}
        {downloaded && openMutexTurbo()}
      </Stack>

      <div style={{ height: "8rem" }}></div>

      <Row style={{ width: '80%', margin: 'auto' }}>
        <Col>
          <h3 style={{ textAlign: 'center' }}> Control Audio </h3>
        </Col>

        <Col>
          <h3 style={{ textAlign: 'center' }}> Stay in Fullscreen Mode </h3>
          <p className="text"> Mutex Turbo allows you to swap tabs while remaining in fullscreen mode. Due to inherent limitations of the browser, no Chrome extension can offer this feature. </p>

        </Col>

        <Col>
          <h3 style={{ textAlign: 'center' }}> Control Desktop Windows </h3>
        </Col>

      </Row>

    </Container>

  );
}

export default Downloads;