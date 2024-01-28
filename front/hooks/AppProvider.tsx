import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { AppStateType } from "../../types/AppStateType";

type AppState = {
  state: AppStateType;
  isConnected: boolean;
}

function useApp(): AppState {
  const [isConnected, setIsConnected] = useState(socket?.connected ?? false);
  const [state, setState] = useState<AppStateType>({
    playbackInfo: {
      status: 'stopped',
    }
  });
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket?.on('connect', onConnect);
    socket?.on('disconnect', onDisconnect);
    socket?.on('updateState', state => {
      console.log(state);
      setState(state);
    })

    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
    };
  }, []);

  return {
    state,
    isConnected
  }
}

const context = createContext<ReturnType<typeof useApp>>(undefined as unknown as ReturnType<typeof useApp>);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const appValue = useApp();

  return (
    <context.Provider value={appValue}>
      {
        children
      }
    </context.Provider>
  )
}

export function useAppContext() {
  return useContext(context);
}