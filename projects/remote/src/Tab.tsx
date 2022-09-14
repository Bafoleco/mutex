import './App.css';
import Card from 'react-bootstrap/Card';
import React, { MouseEvent } from 'react';
import Stack from 'react-bootstrap/esm/Stack';
import Button from 'react-bootstrap/esm/Button';
import { TabInfo } from '../../common/types';

const getSize = (active: boolean) => {
  console.log("getting size: " + active);
  if (active) {
    return {width: 'min(12rem, 50%)', height: '12rem'};
  } else {
    return {width: 'min(12rem, 50%)', height: '12rem'};
  }
}

const getHeaderStyle = (active: boolean) => {
  if (active) {
    return {backgroundColor: 'white'};
  } else {
    return {};
  }
}

const setupButton = (pauseOnExit: boolean, onPauseChange: (arg0: boolean) => void) => {
  console.log("setup button");

  const style = {display: 'block', width: '50%', margin: 'auto'};

  if (pauseOnExit) {
    const onClick = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      console.log("clicked");
      event.stopPropagation();
      onPauseChange(!pauseOnExit);
    }

    return (
      <Button variant="secondary" style={style} onClick={onClick}> Live </Button>
    );
  } else {

    const onClick = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      console.log("clicked");
      event.stopPropagation();
      onPauseChange(!pauseOnExit);
    }

    return (
      <Button variant="danger" style={style} onClick={onClick}> Live </Button>
    );
  }
}

type TabProps = {
  tab: TabInfo,
  active: boolean,
  audible: boolean,
  onClick: React.MouseEventHandler<HTMLElement>,
  onPauseChange: (pauseOnExit: boolean) => void,
  pauseOnExit: boolean,
}

const Tab = (props: TabProps) => {

  const {tab, audible, onClick, active, pauseOnExit, onPauseChange} = props;

  const border = (audible) ? '' : '';

  console.log(tab);

  return (
    <div style={{...getSize(active), padding: '0.2rem'}}>
      <Card border={'light'} onClick={onClick} style={{ border: border, overflow: 'hidden', width: '100%', height: '100%', }}>
        <Card.Header style={{...getHeaderStyle(active)}}> 
          <Stack direction={'horizontal'} style={{fontSize: 'smaller'}}>
            {
              (tab.icon && tab.icon !== '') ? <img style={{width: '1rem', height: '1rem'}} src={tab.icon} alt="favicon"/> : <img style={{width: '1rem', height: '1rem'}} alt=""/>
            }
            <p className='Single-Line'> {tab.title} </p>
          </Stack>
        </Card.Header>
        <Card.Body> 
          <Card.Text className={'Card-Text'} style={{}}> {tab.title} </Card.Text>
          {setupButton(pauseOnExit, onPauseChange)}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Tab;