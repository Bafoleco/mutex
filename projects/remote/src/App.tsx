import './App.css';
import React from 'react';
import Remote from './Remote'
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import { Route, Routes } from 'react-router-dom';
import Info from './Info';
import Downloads from './Downloads';
import Nav from 'react-bootstrap/Nav';
import UAParser from 'ua-parser-js';

function App() {
  console.log('rendering app');
  const uaParser = new UAParser(window.navigator.userAgent);

  const deviceType = uaParser.getDevice().type;

  const isMobile = (deviceType === 'mobile' || deviceType === 'tablet') ? true : false;

  console.log(deviceType);

  return (
    <Col style={{ height: "100%", width: '100%' }}>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand style={isMobile ? { margin: 'auto' } : {}}>
            Mutex Remote
          </Navbar.Brand>
        </Container>
        <Nav>
          {
            !isMobile && <Nav.Link href="/info">Info</Nav.Link>
          }
          {
            !isMobile && <Nav.Link href="/goturbo">Go Turbo</Nav.Link>
          }
        </Nav>
      </Navbar>
      <Routes>
        <Route path="/remote/:id" element={<Remote />} />
        <Route path="/info" element={<Info />} />
        <Route path="/goturbo" element={<Downloads />} />
      </Routes>
    </Col>
  );
}

export default App;
