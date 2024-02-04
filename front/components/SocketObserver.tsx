import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../hooks/AppProvider';
import { Box, useToast } from '@chakra-ui/react';
import React from 'react';

export function SocketObserver() {
  const { isConnected } = useAppContext();
  const [timerId, setTimerId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (timerId) clearTimeout(timerId);
    if (!isConnected) {
      const id = setTimeout(() => {
        // show error alert
        toast({
          title: 'Connection lost',
          description: 'Attempting to reconnect...',
          status: 'error',
          duration: null,
          isClosable: true,
          position: 'top-right',
        });
      }, 5_000) as unknown as number;
      setTimerId(id);
    } else {
      toast.closeAll();
    }
  }, [isConnected]);

  return <Box></Box>;
}
