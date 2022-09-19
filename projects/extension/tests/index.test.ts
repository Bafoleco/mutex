import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { RegisteredTabs, TabInfo } from '../../common/types';
import { handle_tab_move, handle_tab_remove } from '../src/background/handle_tab_changes';
import { getNumTabs } from '../src/shared/util';

// jest.mock('./myModule', () => ({ 
//   ...jest.requireActual('../src/shared/util'), 
//   otherFn: () => {}}))

const tabInfo: TabInfo = { index: 1, title: 'test', url: 'test.com', icon: 'test.png', status: '', active: true, pendingUrl: '', muted: false };
const registeredTabs: RegisteredTabs = { "1": { "2": tabInfo, "3": tabInfo }, "4": { "5": tabInfo } };

describe('util functions work', () => {
  test('get num tabs is working', () => {
    expect(getNumTabs(registeredTabs)).toBe(3);
  });
});

describe('tab change handlers are working', () => {

});
