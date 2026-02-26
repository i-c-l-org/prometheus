import type { ScanOptions, ScanResult } from './licensas.js';
export declare function scan({ root, includeDev: _includeDev }?: ScanOptions): Promise<ScanResult>;
export declare function fsReaddir(p: string): Promise<string[]>;
export declare function scanCommand(opts?: ScanOptions): Promise<ScanResult>;
//# sourceMappingURL=scanner.d.ts.map