import React from 'react';
import Stack from 'react-bootstrap/Stack';
import Tab from './Tab';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { WindowState } from '../../common/types';

type WindowDisplayProps = {
  audibleTab: number | undefined,
  visibleTab: number | undefined,
  windowTabs: WindowState,
  windowId: number,
  index: number,
  getOnClickFunction: (windowId: number, tabId: number) => () => void,
  getOnPauseChange: (windowId: number, tabId: number) => (pauseOnExit: boolean) => void,
  sendWindowFocusUpdate: (windowId: number) => void,
}

export const WindowDisplay = (props: WindowDisplayProps) => {

  const {windowId, windowTabs, visibleTab, audibleTab, 
    index, getOnClickFunction, getOnPauseChange, sendWindowFocusUpdate} = props;

  const sortedTabs = Object.keys(windowTabs).sort((a, b) => {
    return windowTabs[a].index - windowTabs[b].index;
  });

  console.log("visible tab: " + visibleTab);
  console.log(typeof visibleTab);

  return (
    <Card>
      <Card.Header>
        Window {index + 1}

        <Button onClick={() => sendWindowFocusUpdate(windowId)}> Focus Window </Button>
      </Card.Header>
      <Card.Body style={{backgroundColor: 'lightgray', padding: '0.25rem'}}>
        <Stack direction="horizontal" style={{flexWrap: 'wrap'}}>
            {
              sortedTabs.map((tabId) => {
                return(
                    <Tab 
                      active={visibleTab === parseInt(tabId)}
                      key={tabId}
                      tab={windowTabs[tabId]} 
                      audible={parseInt(tabId) === audibleTab} 
                      onClick={getOnClickFunction(windowId, parseInt(tabId))}
                      onPauseChange={getOnPauseChange(windowId, parseInt(tabId))}
                      pauseOnExit={false}
                    />
                );
              })}
        </Stack>
      </Card.Body>
    </Card>
  );

  // return (
  //   <Container fluid style={{padding: '0'}}>
  //     <h5> Window {index + 1} </h5>
  //     <Stack direction="horizontal" style={{flexWrap: 'wrap', backgroundColor: 'lightgray', borderRadius: '0.2rem', padding: '0.5rem'}}>
  //       {
  //         sortedTabs.map((tabId) => {
  //           return(
  //               <Tab 
  //                 active={visibleTab === parseInt(tabId)}
  //                 key={tabId}
  //                 tab={windowTabs[tabId]} 
  //                 audible={tabId === audibleTab} 
  //                 onClick={getOnClickFunction(windowId, tabId)}
  //               />
  //           );
  //         })}
  //     </Stack>
  //   </Container>
  // );
}