// SPDX-License-Identifier: MIT-0
/**
 * @fileoverview Tipos para sistema de memória conversacional
 */

export type MemoryMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export type PrometheusRunRecord = {
  id: string;
  timestamp: string;
  cwd: string;
  argv: string[];
  version?: string;
  ok?: boolean;
  exitCode?: number;
  durationMs?: number;
  error?: string;
};

export type PrometheusContextState = {
  schemaVersion: 1;
  lastRuns: PrometheusRunRecord[];
  preferences: Record<string, unknown>;
};
