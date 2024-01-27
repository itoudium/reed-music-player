import EventEmitter from "events";

export function waitForEvent(eventEmitter: EventEmitter, eventName: string) {
  return new Promise<void>((resolve, _) => {
    eventEmitter.once(eventName, () => {
      resolve();
    });
  });
}