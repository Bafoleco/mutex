import './App.css';
import Card from 'react-bootstrap/Card';
import React from 'react';
import Stack from 'react-bootstrap/esm/Stack';
import { TabInfo } from '../../common/types';

const getSize = (active: boolean) => {
  // console.log("getting size: " + active);
  if (active) {
    return { width: 'min(12rem, 50%)', height: '12rem' };
  } else {
    return { width: 'min(12rem, 50%)', height: '12rem' };
  }
}

const getHeaderStyle = (active: boolean) => {
  if (active) {
    return { backgroundColor: 'white' };
  } else {
    return {};
  }
}

type TabProps = {
  tab: TabInfo,
  active: boolean,
  audible: boolean,
  onClick: React.MouseEventHandler<HTMLElement>,
}

const getBorder = (audible: boolean, active: boolean) => {
  if (audible && active) {
    return "primary";
  }
  if (active) {
    return "dark";
  }
  return 'secondary';
}


const getPadding = (active: boolean) => {
  if (active) {
    return '0.15rem';
  } else {
    return '0.4rem';
  }
}

const Tab = (props: TabProps) => {

  const { tab, audible, onClick, active } = props;

  const border = (audible) ? '' : '';

  // console.log(tab);

  return (
    <div style={{ ...getSize(active), padding: getPadding(active) }}>
      <Card bg="light" border={getBorder(audible, active)} onClick={onClick} style={{ border: border, overflow: 'hidden', width: '100%', height: '100%', }}>
        <Card.Header>
          <Stack direction={'horizontal'} style={{ fontSize: 'smaller' }}>
            {
              (tab.icon && tab.icon !== '') ? <img style={{ width: '1rem', height: '1rem' }} src={tab.icon} alt="favicon" /> : <img style={{ width: '1rem', height: '1rem' }} alt="" />
            }
            <p className='Single-Line'> {tab.title} </p>
          </Stack>
        </Card.Header>
        <Card.Body>
          <Card.Text className={'Card-Text'} style={{}}> {tab.title} </Card.Text>
          {/* {setupButton(pauseOnExit, onPauseChange)} */}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Tab;