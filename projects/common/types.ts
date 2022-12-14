export type TabInfo = {
  index: number,
  title: string | undefined,
  icon: string | undefined,
  status: string | undefined,
  url: string | undefined,
  pendingUrl: string | undefined,
}

export type WindowState = {
  [key: string]: TabInfo;
}

export type TabState = {
  [key: string]: WindowState;
}

export type RegisteredTabs = {
  tabState: TabState;
  activeTabs: ActiveTabs;
}

export type VisibleTabs = {
  [key: string]: number
}

export type ActiveTabs = {
  audibleTab: number | undefined,
  visibleTabs: VisibleTabs
}

export type TurboState = {
  isInstalled: boolean,
  isRunning: boolean,
  hasPermissions: boolean,
}

export type TurboStateUpdate = {
  isInstalled?: boolean,
  isRunning?: boolean,
  hasPermissions?: boolean,
}

export type WindowFocusUpdate = {
  windowToFocus: number
}

export type Message = {
  type: string,
  payload: any,
}