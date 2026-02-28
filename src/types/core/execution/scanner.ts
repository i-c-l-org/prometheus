// SPDX-License-Identifier: MIT-0
/**
 * Tipos para o scanner de repositório
 */

import type { Dirent } from 'node:fs';

/**
 * Opções para o scanner de repositório
 */
export interface ScanOptions {
  includeContent?: boolean;
  filter?: (relPath: string, entry: Dirent) => boolean;
  onProgress?: (msg: string) => void;
}
