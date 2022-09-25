import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { ActiveTabs, RegisteredTabs, TabInfo, TabState, VisibleTabs } from '../../common/types';
import { tabRemoveTransformer, tabMoveTransformer, tabAttachedTransformer, tabActivatedTransformer, tabUpdateTransformer } from '../src/background/handle_tab_changes';
import { getTabInfo } from '../src/shared/util';

const extraFields = { windowId: 0, active: false, pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };

describe('tab change handler transformers', () => {
  let testTabInfo: TabInfo = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', pendingUrl: '' };
  let testTabState: TabState = { 11: { 1: testTabInfo, 2: testTabInfo }, 12: { 3: testTabInfo } }
  let testVisibleTabs: VisibleTabs = { 11: 1, 12: 3 };
  let testActiveTabs: ActiveTabs = { audibleTab: 1, visibleTabs: testVisibleTabs };
  let testRegisteredTabs: RegisteredTabs = { tabState: testTabState, activeTabs: testActiveTabs }
  let testTab = { ...testTabInfo, ...extraFields };

  beforeEach(() => {
    testTabInfo = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', pendingUrl: '' };
    testTabState = { 11: { 1: testTabInfo, 2: testTabInfo }, 12: { 3: testTabInfo } }
    testVisibleTabs = { 11: 1, 12: 3 };
    testActiveTabs = { audibleTab: 1, visibleTabs: testVisibleTabs };
    testRegisteredTabs = { tabState: testTabState, activeTabs: testActiveTabs }
    testTab = { ...testTabInfo, ...extraFields };
  });

  const testTabInfoChanged: TabInfo = { ...testTabInfo, index: 2 };

  const getTabInfoIdMock = jest.fn(async (tabId: number) => {
    return testTabInfoChanged;
  })

  test('test tabMoveTransformer', async () => {
    const testMoveInfo = { windowId: 11, toIndex: 0, fromIndex: 0 };
    const transformed = await tabMoveTransformer(testRegisteredTabs, 1, testMoveInfo, getTabInfoIdMock)

    //assert
    expect(transformed.tabState).toEqual({ 11: { 1: testTabInfoChanged, 2: testTabInfoChanged }, 12: { 3: testTabInfo } });
  });

  test('test tabMoveTransformer empty window', async () => {
    const testMoveInfo = { windowId: 13, toIndex: 0, fromIndex: 0 };
    const transformed = await tabMoveTransformer(testRegisteredTabs, 1, testMoveInfo, getTabInfoIdMock)

    //assert
    expect(transformed).toEqual(testRegisteredTabs);
  });

  test('test tabRemoveTransformer', async () => {
    const removeInfo = { windowId: 11, isWindowClosing: false }
    const newRegisteredTabs = await tabRemoveTransformer(testRegisteredTabs, 1, removeInfo);

    //assert
    const expectedTabState = { ...testTabState };
    delete expectedTabState[11][1];

    const expectedActiveTabs = { ...testActiveTabs };
    expectedActiveTabs.audibleTab = undefined;
    //TODO handle visual tabs here

    expect(newRegisteredTabs.tabState).toEqual(expectedTabState);
    expect(newRegisteredTabs.activeTabs).toEqual(expectedActiveTabs);

  });

  test('test tabRemoveTransformer last in window', async () => {
    const removeInfo = { windowId: 12, isWindowClosing: false }
    const newRegisteredTabs = await tabRemoveTransformer(testRegisteredTabs, 1, removeInfo);

    //assert
    const expectedTabState = { ...testTabState };
    delete expectedTabState[12][3];

    const expectedActiveTabs = { ...testActiveTabs };
    delete expectedActiveTabs.visibleTabs[12]

    expect(newRegisteredTabs.tabState).toEqual(expectedTabState);
    expect(newRegisteredTabs.activeTabs).toEqual(expectedActiveTabs);
  });


  //TODO add test for muted handling
  test('test tabUpdateTransformer', () => {

    const updatedTab = { ...testTab, title: "new title" };

    const tabChangeInfo = { title: "new title" }

    const newRegisteredTabs = tabUpdateTransformer(testRegisteredTabs, 1, tabChangeInfo, updatedTab);

    const expectedTabState = { ...testRegisteredTabs.tabState }
    expectedTabState[11][1] = getTabInfo(updatedTab);

    expect(newRegisteredTabs.tabState).toEqual(expectedTabState);

  });


  test('test tabAttachedTransformer', async () => {

    const tabAttachInfo = { newWindowId: 12, newPosition: 0 };

    console.log(testRegisteredTabs);

    const newRegisteredTabs = await tabAttachedTransformer(testRegisteredTabs, 1, tabAttachInfo, getTabInfoIdMock)

    console.log(newRegisteredTabs.tabState);

    //assert
    const expectedTabState = { 11: { 2: testTabInfo }, 12: { 1: testTabInfoChanged, 3: testTabInfo } };
    expect(newRegisteredTabs.tabState).toEqual(expectedTabState);
    expect(newRegisteredTabs.activeTabs.visibleTabs[12]).toBe(1);
    expect(newRegisteredTabs.activeTabs.audibleTab).toBe(testActiveTabs.audibleTab);
  });




});


// import { describe, expect, test, jest, beforeEach } from '@jest/globals';
// import { RegisteredTabs, TabInfo } from '../../common/types';
// import { tabRemoveTransformer, tabMoveTransformer, tabAttachedTransformer, tabActivatedTransformer, tabUpdateTransformer } from '../src/background/handle_tab_changes';

// describe('tab change handler transformers', () => {
//   const tabInfo: TabInfo = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', pendingUrl: '' };
//   const registeredTabs: RegisteredTabs = {
//     tabState: { "1": { "2": tabInfo, "3": tabInfo }, "4": { "5": tabInfo } },
//     activeTabs: { visibleTabs: { "1": 2, "4": 5 }, audibleTab: 1 }
//   };

//   test('test tabMoveTransformer', async () => {

//     // const postTransform = await tabMoveTransformer(registeredTabs, 2, { windowId: 1, fromIndex: 1, toIndex: 2 });

//     // expect(postTransform).toEqual({ "1": { "2": { ...tabInfo, index: 2 }, "3": tabInfo }, "4": { "5": tabInfo } });

//     expect(true).toBe(true);
//   });

//   test('test tabRemoveTransformer normal', async () => {
//     const postTransform = await tabRemoveTransformer(registeredTabs, 2, { windowId: 1, isWindowClosing: false });
//     expect(postTransform).toEqual({ "1": { "3": tabInfo }, "4": { "5": tabInfo } });
//   });

//   test('test tabRemoveTransformer last tab in window', async () => {
//     const postTransform = await tabRemoveTransformer(registeredTabs, 5, { windowId: 4, isWindowClosing: false });
//     expect(postTransform).toEqual({ "1": { "2": tabInfo, "3": tabInfo } });
//   });

//   // test('test tabAttachedTransformer', async () => {

//   //   const tab: chrome.tabs.Tab = { id: 2, windowId: 1, index: 1, title: 'test', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };

//   //   global.chrome.tabs = {
//   //     ...chrome.tabs,
//   //     get: jest.fn((tabId: number) => Promise.resolve(tab)),
//   //   };

//   //   const postTransform = await tabAttachedTransformer(registeredTabs, 2, { newWindowId: 4, newPosition: 1 });
//   //   expect(postTransform).toEqual({ "1": { "3": tabInfo }, "4": { "2": { ...tabInfo, index: 1 }, "5": tabInfo } });
//   // });

//   test('test tabUpdatedTransformer normal', async () => {
//     const tab = { id: 2, windowId: 1, index: 1, title: 'new title', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };
//     const postTransform = await tabUpdateTransformer(registeredTabs, 2, {}, tab);
//     expect(postTransform).toEqual({ "1": { "2": { ...tabInfo, title: 'new title' }, "3": tabInfo }, "4": { "5": tabInfo } });
//   });

//   test('test tabUpdatedTransformer non registered update', async () => {
//     const tab = { id: 10, windowId: 1, index: 1, title: 'new title', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };
//     const postTransform = await tabUpdateTransformer(registeredTabs, 10, {}, tab);
//     expect(postTransform).toEqual(registeredTabs);
//   });

//   test('test tabActivatedTransformer normal', async () => {
//     const nonActiveTab = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', active: false, pendingUrl: '', muted: false };
//     const activeTab = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', active: true, pendingUrl: '' };
//     const registeredTabs: RegisteredTabs = {
//       tabState: { "1": { "2": nonActiveTab, "3": nonActiveTab }, "4": { "5": nonActiveTab } };

//       const postTransform = await tabActivatedTransformer(registeredTabs, { windowId: 1, tabId: 2 });
//       expect(postTransform).toEqual({ "1": { "2": activeTab, "3": nonActiveTab }, "4": { "5": nonActiveTab } });
//     });

// });
