export class BroadcastChannel {
  constructor(public name: string) {}
  postMessage = jest.fn();
  close = jest.fn();
  onmessage = null;
}