// import { describe, expect, test, jest, beforeEach } from '@jest/globals';
// import { RegisteredTabs, TabInfo } from '../../common/types';
// import { deregisterTabTransformer, registerTabTransformer } from '../src/shared/util';

// describe('tab registration transformers', () => {

//   const tabInfo: TabInfo = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', active: true, pendingUrl: '', muted: false };
//   const registeredTabs: RegisteredTabs = { "1": { "2": tabInfo, "3": tabInfo }, "4": { "5": tabInfo } };

//   test('register tab in new window', () => {
//     const registeredTabs: RegisteredTabs = { "1": { "2": tabInfo, "3": tabInfo }, "4": { "5": tabInfo } };
//     const tab = { id: 10, windowId: 10, index: 1, title: 'test', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };

//     const postTransform = registerTabTransformer(registeredTabs, tab);
//     expect(postTransform).toEqual({ "1": { "2": tabInfo, "3": tabInfo }, "4": { "5": tabInfo }, "10": { "10": tabInfo } });
//   });

//   test('register tab in existing window', () => {
//     const registeredTabs: RegisteredTabs = { "1": { "2": tabInfo, "3": tabInfo }, "4": { "5": tabInfo } };
//     const tab = { id: 10, windowId: 1, index: 1, title: 'test', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };

//     const postTransform = registerTabTransformer(registeredTabs, tab);
//     expect(postTransform).toEqual({ "1": { "2": tabInfo, "3": tabInfo, "10": tabInfo }, "4": { "5": tabInfo } });
//   });

//   test('unregister tab with others remaining', () => {
//     const registeredTabs: RegisteredTabs = { "1": { "2": tabInfo, "3": tabInfo }, "4": { "5": tabInfo } };
//     const tab = { id: 2, windowId: 1, index: 1, title: 'test', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };

//     const postTransform = deregisterTabTransformer(registeredTabs, tab);
//     expect(postTransform).toEqual({ "1": { "3": tabInfo }, "4": { "5": tabInfo } });
//   });

//   test('unregister last tab in window', () => {
//     const registeredTabs: RegisteredTabs = { "1": { "2": tabInfo, "3": tabInfo }, "4": { "5": tabInfo } };
//     const tab = { id: 5, windowId: 4, index: 1, title: 'test', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };

//     const postTransform = deregisterTabTransformer(registeredTabs, tab);
//     expect(postTransform).toEqual({ "1": { "2": tabInfo, "3": tabInfo } });
//   });

//   test('unregister last tab', () => {
//     const registeredTabs: RegisteredTabs = { "4": { "5": tabInfo } };
//     const tab = { id: 5, windowId: 4, index: 1, title: 'test', url: 'test.com', favIconUrl: 'test.png', status: '', active: true, pendingUrl: '', pinned: false, highlighted: false, incognito: false, selected: false, discarded: false, autoDiscardable: false, groupId: 0 };

//     const postTransform = deregisterTabTransformer(registeredTabs, tab);
//     expect(postTransform).toEqual({});
//   });
// });