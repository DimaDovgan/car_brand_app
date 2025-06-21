import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';
// global.BroadcastChannel = class {
//   name: string;
//   onmessage: ((message: any) => void) | null = null;

//   constructor(name: string) {
//     this.name = name;
//   }

//   postMessage = jest.fn();
//   close = jest.fn();
// };
Object.assign(global, {
  TextEncoder,
  TextDecoder,
});