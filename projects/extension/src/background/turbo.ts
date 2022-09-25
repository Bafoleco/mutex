import { getLocal, getLocalAsync, setLocal } from "../shared/util";
import { TURBO_STATE, MUTEX_TURBO_API, FULL_PERMISSIONS, ID, SERVER_URL } from "../../../common/constants";
import { TurboStateUpdate } from "../../../common/types";

export const isTurboRunning = async () => {
  return (await getLocalAsync(TURBO_STATE)).isRunning;
}

const sendStateUpdate = async (stateUpdate: TurboStateUpdate) => {
  getLocal(ID, async (id) => {
    console.log("sending state update: " + JSON.stringify(stateUpdate) + " to " + id);
    try {
      await fetch(`${SERVER_URL}/turbo/setState/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stateUpdate: stateUpdate })
      });
    } catch (e) {
      console.error(e);
    }
    console.log("after fetch");
  });
}

export const setTurboHasPermissions = async (hasPermissions: boolean) => {

  sendStateUpdate({ hasPermissions: hasPermissions });

  getLocal(TURBO_STATE, (turboState) => {
    turboState.hasPermissions = hasPermissions;
    setLocal(TURBO_STATE, turboState);
  });
}

export const setTurboIsRunning = (isRunning: boolean) => {
  getLocal(TURBO_STATE, (turboState) => {
    turboState.isRunning = isRunning;
    setLocal(TURBO_STATE, turboState);
  });
}

export const setTurboIsInstalled = (isInstalled: boolean) => {
  getLocal(TURBO_STATE, (turboState) => {
    turboState.isInstalled = isInstalled;
    setLocal(TURBO_STATE, turboState);
  });
}

export const sendTurboHeartbeat = async () => {
  const id = await getLocalAsync(ID);
  try {
    const res = await fetch(`${MUTEX_TURBO_API}/heartbeat/${id}`);
    if (res.ok) {
      console.log("Mutex Turbo is up and running.");
      setTurboIsRunning(true);
    } else {
      console.log("Mutex Turbo is not running.");
      setTurboIsRunning(false);
    }
  } catch (e) {
    console.log("Mutex Turbo is not running.");
    console.log(e);
    setTurboIsRunning(false);
  }
}

export const turboTimerHandler = async () => {
  console.log("turbo timer handler");
  const turboState = await getLocalAsync(TURBO_STATE);
  if (turboState.hasPermissions && turboState.isInstalled) {
    sendTurboHeartbeat();
  }
}