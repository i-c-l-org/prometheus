import type { MemoryMessage, PrometheusContextState, PrometheusRunRecord } from '../types/index.js';
export type { MemoryMessage, PrometheusContextState, PrometheusRunRecord };
export declare class ConversationMemory {
    private maxHistory;
    private persistCaminho?;
    private history;
    constructor(maxHistory?: number, persistCaminho?: string | undefined);
    init(): Promise<void>;
    addMessage(message: MemoryMessage): Promise<void>;
    getContext(lastN?: number): MemoryMessage[];
    getSummary(): {
        totalMessages: number;
        userMessages: number;
        assistantMessages: number;
        firstMessage?: string;
        lastMessage?: string;
    };
    clear(): Promise<void>;
    private persist;
}
export declare class PrometheusContextMemory {
    private maxRuns;
    private persistCaminho?;
    private state;
    constructor(maxRuns?: number, persistCaminho?: string | undefined);
    init(): Promise<void>;
    getState(): PrometheusContextState;
    getLastRun(): PrometheusRunRecord | undefined;
    getPreference<T = unknown>(key: string): T | undefined;
    setPreference(key: string, value: unknown): Promise<void>;
    recordRunStart(input: {
        cwd: string;
        argv: string[];
        version?: string;
        timestamp?: string;
    }): Promise<string>;
    recordRunEnd(id: string, update: {
        ok: boolean;
        exitCode?: number;
        durationMs?: number;
        error?: string;
    }): Promise<void>;
    clear(): Promise<void>;
    private persist;
}
export declare function getDefaultMemory(): Promise<ConversationMemory>;
export declare function getDefaultContextMemory(): Promise<PrometheusContextMemory>;
//# sourceMappingURL=memory.d.ts.map