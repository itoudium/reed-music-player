import EventEmitter from 'events';

export function waitForEvent(eventEmitter: EventEmitter, eventName: string) {
  return new Promise<void>((resolve) => {
    eventEmitter.once(eventName, () => {
      resolve();
    });
  });
}
