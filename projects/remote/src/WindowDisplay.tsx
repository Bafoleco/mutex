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

  const { windowId, windowTabs, visibleTab, audibleTab,
    index, getOnClickFunction, getOnPauseChange, sendWindowFocusUpdate } = props;

  const sortedTabs = Object.keys(windowTabs).sort((a, b) => {
    return windowTabs[a].index - windowTabs[b].index;
  });

  // console.log("visible tab: " + visibleTab);
  // console.log(typeof visibleTab);

  // return (
  //   <Card>
  //     <Card.Header>
  //       <Stack direction='horizontal'>
  //         {`Window ${index + 1}`}
  //         <Button variant='outline-secondary' style={{ display: 'block', marginRight: '1rem', marginLeft: 'auto' }} onClick={() => sendWindowFocusUpdate(windowId)}> Focus Window </Button>
  //       </Stack>
  //     </Card.Header>
  //     <Card.Body style={{ backgroundColor: 'lightgray', padding: '0.25rem' }}>
  //       <Stack direction="horizontal" style={{ flexWrap: 'wrap' }}>
  //         {
  //           sortedTabs.map((tabId) => {
  //             return (
  //               <Tab
  //                 active={visibleTab === parseInt(tabId)}
  //                 key={tabId}
  //                 tab={windowTabs[tabId]}
  //                 audible={parseInt(tabId) === audibleTab}
  //                 onClick={getOnClickFunction(windowId, parseInt(tabId))}
  //                 onPauseChange={getOnPauseChange(windowId, parseInt(tabId))}
  //                 pauseOnExit={false}
  //               />
  //             );
  //           })}
  //       </Stack>
  //     </Card.Body>
  //   </Card>
  // );

  return (
    <Stack>
      <Stack direction="horizontal" style={{ flexWrap: 'wrap' }}>
        {
          sortedTabs.map((tabId) => {
            return (
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
      <hr style={{ marginTop: '0.25rem', marginBottom: '0.25rem', height: '2px', color: 'black' }} />
    </Stack>
  );
}