import * as React from 'react';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import * as ReactDOMClient from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

const container = document.getElementById('app');

// Create a root.
const root = ReactDOMClient.createRoot(container);

// Initial render: Render an element to the root.
root.render(
  <React.StrictMode>
    <Col>
      <Navbar bg="dark" variant="dark" className='titlebar'>
        <Container>
          <Navbar.Brand style={{userSelect: 'none'}} className={'mx-auto'}>
            Mutex Turbo
          </Navbar.Brand>
        </Container>
      </Navbar>
      <App/>
    </Col>
  </React.StrictMode>);