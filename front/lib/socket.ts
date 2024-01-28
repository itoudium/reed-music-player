import { io } from 'socket.io-client';

export const socket = (typeof window === "undefined") ? null : io(undefined);

