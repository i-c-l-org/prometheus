// SPDX-License-Identifier: MIT-0
import type { Estatisticas } from '@';

export type { Estatisticas };

export const createEstatisticas = (): Estatisticas => ({
  requires: {},
  consts: {},
  exports: {},
  vars: {},
  lets: {},
  evals: {},
  withs: {}
});

// Estatísticas globais compartilhadas entre analistas e relatorios
export const estatisticasUsoGlobal: Estatisticas = createEstatisticas();
