import React from "react";
import Container from "react-bootstrap/esm/Container";
import { BACKGROUND_COLOR } from './constants';

const Info = () => {

  return (
    <Container fluid style={{backgroundColor: BACKGROUND_COLOR, height: '100%', width: '100%'}}>
      <p className="text"> Welcome to Mutex! </p>
    </Container>
  );
}

export default Info;