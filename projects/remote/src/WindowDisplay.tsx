import React from 'react';
import Stack from 'react-bootstrap/Stack';
import Tab from './Tab';
import { WindowState } from '../../common/types';

type WindowDisplayProps = {
  audibleTab: number | undefined,
  visibleTab: number | undefined,
  windowTabs: WindowState,
  windowId: number,
  index: number,
  getOnClickFunction: (windowId: number, tabId: number) => () => void,
  sendWindowFocusUpdate: (windowId: number) => void,
}

export const WindowDisplay = (props: WindowDisplayProps) => {

  const { windowId, windowTabs, visibleTab, audibleTab,
    getOnClickFunction } = props;

  const sortedTabs = Object.keys(windowTabs).sort((a, b) => {
    return windowTabs[a].index - windowTabs[b].index;
  });

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
              />
            );
          })}
      </Stack>
      <hr style={{ marginTop: '0.25rem', marginBottom: '0.25rem', height: '2px', color: 'black' }} />
    </Stack>
  );
}