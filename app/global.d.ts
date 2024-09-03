/* declare the gtag function on the Window interface as TypeScript 
does not have type definitions for gtag by default. It is used for Google Analytics API.
*/
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export {};
