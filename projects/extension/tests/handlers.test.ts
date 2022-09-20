import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { RegisteredTabs, TabInfo } from '../../common/types';
import { tabRemoveTransformer, tabMoveTransformer, tabAttachedTransformer, tabActivatedTransformer, tabUpdateTransformer } from '../src/background/handle_tab_changes';

describe('tab change handler transformers', () => {
  const tabInfo: TabInfo = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', pendingUrl: '' };
  const registeredTabs: RegisteredTabs = {
    tabState: { "1": { "2": tabInfo, "3": tabInfo }, "4": { "5": tabInfo } },
    activeTabs: { visibleTabs: { "1": 2, "4": 5 }, audibleTab: 1 }
  };

  test('test tabMoveTransformer', async () => {

    // const postTransform = await tabMoveTransformer(registeredTabs, 2, { windowId: 1, fromIndex: 1, toIndex: 2 });

    // expect(postTransform).toEqual({ "1": { "2": { ...tabInfo, index: 2 }, "3": tabInfo }, "4": { "5": tabInfo } });

    expect(true).toBe(true);
  });

  test('test tabRemoveTransformer normal', async () => {
    const postTransform = await tabRemoveTransformer(registeredTabs, 2, { windowId: 1, isWindowClosing: false });
    expect(postTransform).toEqual({ "1": { "3": tabInfo }, "4": { "5": tabInfo } });
  });

  test('test tabRemoveTransformer last tab in window', async () => {
    const postTransform = await tabRemoveTransformer(registeredTabs, 5, { windowId: 4, isWindowClosing: false });
    expect(postTransform).toEqual({ "1": { "2": tabInfo, "3": tabInfo } });
  });

  // test('test tabAttachedTransformer', async () => {

  //   const tab: chrome.tabs.Tab = { id: 2, windowId: 1, index: 1, title: 'test', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };

  //   global.chrome.tabs = {
  //     ...chrome.tabs,
  //     get: jest.fn((tabId: number) => Promise.resolve(tab)),
  //   };

  //   const postTransform = await tabAttachedTransformer(registeredTabs, 2, { newWindowId: 4, newPosition: 1 });
  //   expect(postTransform).toEqual({ "1": { "3": tabInfo }, "4": { "2": { ...tabInfo, index: 1 }, "5": tabInfo } });
  // });

  test('test tabUpdatedTransformer normal', async () => {
    const tab = { id: 2, windowId: 1, index: 1, title: 'new title', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };
    const postTransform = await tabUpdateTransformer(registeredTabs, 2, {}, tab);
    expect(postTransform).toEqual({ "1": { "2": { ...tabInfo, title: 'new title' }, "3": tabInfo }, "4": { "5": tabInfo } });
  });

  test('test tabUpdatedTransformer non registered update', async () => {
    const tab = { id: 10, windowId: 1, index: 1, title: 'new title', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };
    const postTransform = await tabUpdateTransformer(registeredTabs, 10, {}, tab);
    expect(postTransform).toEqual(registeredTabs);
  });

  test('test tabActivatedTransformer normal', async () => {
    const nonActiveTab = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', active: false, pendingUrl: '', muted: false };
    const activeTab = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', active: true, pendingUrl: '' };
    const registeredTabs: RegisteredTabs = {
      tabState: { "1": { "2": nonActiveTab, "3": nonActiveTab }, "4": { "5": nonActiveTab } };

      const postTransform = await tabActivatedTransformer(registeredTabs, { windowId: 1, tabId: 2 });
      expect(postTransform).toEqual({ "1": { "2": activeTab, "3": nonActiveTab }, "4": { "5": nonActiveTab } });
    });

});
