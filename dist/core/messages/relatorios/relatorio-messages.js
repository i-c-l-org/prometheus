import { createI18nMessages } from '../../../shared/helpers/i18n.js';
import { ICONES_ACAO, ICONES_COMANDO, ICONES_DIAGNOSTICO, ICONES_RELATORIO } from '../ui/icons.js';
export const RelatorioMensagens = createI18nMessages({
    principal: {
        titulo: `${ICONES_RELATORIO.resumo} Relatório Prometheus`,
        secoes: {
            metadados: {
                data: 'Data',
                duracao: 'Duração',
                arquivos: 'Arquivos escaneados',
                ocorrencias: 'Ocorrências encontradas',
                arquivoManifest: 'Arquivo manifest',
                notaManifest: 'Para explorar o relatório completo, baixe/descomprima os shards listados no manifest.'
            },
            guardian: {
                titulo: `${ICONES_DIAGNOSTICO.guardian} Verificação de Integridade (Guardian)`,
                status: 'Status',
                timestamp: 'Timestamp',
                totalArquivos: 'Total de arquivos protegidos'
            },
            resumoTipos: {
                titulo: `${ICONES_DIAGNOSTICO.stats} Resumo dos tipos de problemas`,
                tipo: 'Tipo',
                quantidade: 'Quantidade'
            },
            ocorrencias: {
                titulo: `${ICONES_RELATORIO.lista} Ocorrências encontradas`,
                colunas: {
                    arquivo: 'Arquivo',
                    linha: 'Linha',
                    nivel: 'Nível',
                    mensagem: 'Mensagem'
                }
            },
            estatisticas: {
                titulo: `${ICONES_RELATORIO.grafico} Estatísticas gerais`,
                linhasAnalisadas: 'Linhas analisadas',
                padroesProgramacao: 'Padrões de programação',
                analiseInteligente: 'Análise inteligente de código'
            }
        }
    },
    resumo: {
        titulo: `${ICONES_RELATORIO.resumo} Relatório Resumido - Problemas Prioritários`,
        introducao: 'Este relatório agrupa problemas similares e prioriza por impacto para facilitar a análise.',
        secoes: {
            criticos: {
                titulo: `${ICONES_RELATORIO.error} Problemas Críticos`,
                vazio: 'Nenhum problema crítico detectado.'
            },
            altos: {
                titulo: `${ICONES_RELATORIO.warning} Problemas de Alta Prioridade`,
                vazio: 'Nenhum problema de alta prioridade detectado.'
            },
            outros: {
                titulo: `${ICONES_RELATORIO.lista} Outros Problemas`,
                vazio: 'Nenhum outro problema detectado.'
            },
            estatisticas: {
                titulo: `${ICONES_DIAGNOSTICO.stats} Estatísticas do Relatório`,
                totalOcorrencias: 'Total de ocorrências',
                arquivosAfetados: 'Arquivos afetados',
                problemasPrioritarios: 'Problemas prioritários',
                problemasAgrupados: 'Problemas agrupados'
            }
        },
        labels: {
            quantidade: 'Quantidade',
            arquivosAfetados: 'Arquivos afetados',
            acaoSugerida: 'Ação Sugerida',
            exemplos: 'Exemplos'
        }
    },
    saude: {
        titulo: `${ICONES_ACAO.limpeza} Relatório de Saúde do Código`,
        introducao: `${ICONES_DIAGNOSTICO.stats} Padrões de Uso do Código`,
        secoes: {
            funcoesLongas: {
                titulo: 'Detalhes de funções longas por arquivo',
                vazio: 'Nenhuma função acima do limite.',
                colunas: {
                    tipo: 'Tipo',
                    quantidade: 'Quantidade'
                }
            },
            constantesDuplicadas: {
                titulo: `${ICONES_RELATORIO.detalhado} Constantes definidas mais de 3 vezes`
            },
            modulosRequire: {
                titulo: `${ICONES_RELATORIO.detalhado} Módulos require utilizados mais de 3 vezes`
            },
            fim: {
                titulo: 'Fim do relatório do zelador'
            }
        },
        instrucoes: {
            diagnosticoDetalhado: 'Para diagnóstico detalhado, execute: prometheus diagnosticar --export',
            tabelasVerbosas: 'Para ver tabelas com moldura no terminal (muito verboso), use: --debug'
        }
    },
    padroesUso: {
        titulo: `${ICONES_DIAGNOSTICO.stats} Padrões de Uso do Código`
    },
    arquetipos: {
        titulo: `${ICONES_DIAGNOSTICO.arquetipos} Relatório de Arquetipos`,
        secoes: {
            candidatos: {
                titulo: 'Candidatos Identificados',
                nome: 'Nome',
                score: 'Score',
                confianca: 'Confiança',
                descricao: 'Descrição'
            },
            baseline: {
                titulo: 'Baseline Salvo',
                snapshot: 'Snapshot',
                arquivos: 'Arquivos'
            },
            drift: {
                titulo: 'Drift Detectado',
                alterouArquetipo: 'Alterou Arquétipo',
                deltaConfianca: 'Delta de Confiança',
                arquivosNovos: 'Arquivos Novos',
                arquivosRemovidos: 'Arquivos Removidos'
            }
        }
    },
    poda: {
        titulo: `${ICONES_COMANDO.podar} Relatório de Poda Prometheus`,
        secoes: {
            metadados: {
                data: 'Data',
                execucao: 'Execução',
                simulacao: 'Simulação',
                real: 'Real',
                arquivosPodados: 'Arquivos podados',
                arquivosMantidos: 'Arquivos mantidos'
            },
            podados: {
                titulo: 'Arquivos Podados',
                vazio: 'Nenhum arquivo foi podado neste ciclo.',
                colunas: {
                    arquivo: 'Arquivo',
                    motivo: 'Motivo',
                    diasInativo: 'Dias Inativo',
                    detectadoEm: 'Detectado em'
                }
            },
            mantidos: {
                titulo: 'Arquivos Mantidos',
                vazio: 'Nenhum arquivo mantido neste ciclo.',
                colunas: {
                    arquivo: 'Arquivo',
                    motivo: 'Motivo'
                }
            },
            pendencias: {
                titulo: 'Pendências de Remoção',
                total: 'Total de pendências',
                tipoArquivo: 'Tipo: Arquivo',
                tipoDiretorio: 'Tipo: Diretório',
                tamanhoTotal: 'Tamanho total aproximado'
            },
            reativacao: {
                titulo: 'Lista de Reativação',
                total: 'Total a reativar'
            },
            historico: {
                titulo: 'Histórico de Ações',
                total: 'Total de ações',
                colunas: {
                    acao: 'Ação',
                    caminho: 'Caminho',
                    timestamp: 'Timestamp'
                }
            }
        }
    },
    reestruturar: {
        titulo: `${ICONES_COMANDO.reestruturar} Relatório de Reestruturação Prometheus`,
        secoes: {
            metadados: {
                data: 'Data',
                execucao: 'Execução',
                simulacao: 'Simulação',
                real: 'Real',
                origemPlano: 'Origem do plano',
                preset: 'Preset'
            },
            movimentos: {
                titulo: 'Movimentos',
                total: 'Total de movimentos',
                vazio: 'Nenhum movimento sugerido neste ciclo.',
                status: {
                    zonVerde: 'Zona Verde (seguros)',
                    bloqueados: 'Bloqueados'
                },
                colunas: {
                    origem: 'De',
                    destino: 'Para',
                    razao: 'Razão',
                    status: 'Status'
                }
            },
            conflitos: {
                titulo: 'Conflitos Detectados',
                total: 'Conflitos detectados',
                tipo: 'Tipo',
                descricao: 'Descrição'
            },
            preview: {
                titulo: 'Preview das Mudanças',
                nota: `Nenhum arquivo será movido até executar com --apply`
            }
        }
    },
    comum: {
        separadores: {
            secao: '---',
            subsecao: '~~~'
        },
        vazios: {
            nenhumResultado: 'Nenhum resultado encontrado.',
            nenhumaOcorrencia: 'Nenhuma ocorrência detectada.',
            semDados: 'Sem dados disponíveis.'
        },
        acoes: {
            verDetalhes: 'Ver detalhes completos',
            executarComando: 'Executar comando',
            aplicarMudancas: 'Aplicar mudanças',
            cancelar: 'Cancelar'
        }
    }
}, {
    principal: {
        titulo: `${ICONES_RELATORIO.resumo} Prometheus Report`,
        secoes: {
            metadados: {
                data: 'Date',
                duracao: 'Duration',
                arquivos: 'Scanned files',
                ocorrencias: 'Occurrences found',
                arquivoManifest: 'Manifest file',
                notaManifest: 'To explore the full report, download/decompress the shards listed in the manifest.'
            },
            guardian: {
                titulo: `${ICONES_DIAGNOSTICO.guardian} Integrity Verification (Guardian)`,
                status: 'Status',
                timestamp: 'Timestamp',
                totalArquivos: 'Total protected files'
            },
            resumoTipos: {
                titulo: `${ICONES_DIAGNOSTICO.stats} Summary of problem types`,
                tipo: 'Type',
                quantidade: 'Amount'
            },
            ocorrencias: {
                titulo: `${ICONES_RELATORIO.lista} Occurrences found`,
                colunas: {
                    arquivo: 'File',
                    linha: 'Line',
                    nivel: 'Level',
                    mensagem: 'Message'
                }
            },
            estatisticas: {
                titulo: `${ICONES_RELATORIO.grafico} General statistics`,
                linhasAnalisadas: 'Lines analyzed',
                padroesProgramacao: 'Programming patterns',
                analiseInteligente: 'Intelligent code analysis'
            }
        }
    },
    resumo: {
        titulo: `${ICONES_RELATORIO.resumo} Summary Report - Priority Issues`,
        introducao: 'This report groups similar issues and prioritizes by impact to facilitate analysis.',
        secoes: {
            criticos: {
                titulo: `${ICONES_RELATORIO.error} Critical Issues`,
                vazio: 'No critical issues detected.'
            },
            altos: {
                titulo: `${ICONES_RELATORIO.warning} High Priority Issues`,
                vazio: 'No high priority issues detected.'
            },
            outros: {
                titulo: `${ICONES_RELATORIO.lista} Other Issues`,
                vazio: 'No other issues detected.'
            },
            estatisticas: {
                titulo: `${ICONES_DIAGNOSTICO.stats} Report Statistics`,
                totalOcorrencias: 'Total occurrences',
                arquivosAfetados: 'Affected files',
                problemasPrioritarios: 'Priority issues',
                problemasAgrupados: 'Grouped issues'
            }
        },
        labels: {
            quantidade: 'Amount',
            arquivosAfetados: 'Affected files',
            acaoSugerida: 'Suggested Action',
            exemplos: 'Examples'
        }
    },
    saude: {
        titulo: `${ICONES_ACAO.limpeza} Code Health Report`,
        introducao: `${ICONES_DIAGNOSTICO.stats} Code Usage Patterns`,
        secoes: {
            funcoesLongas: {
                titulo: 'Long function details by file',
                vazio: 'No functions above the limit.',
                colunas: {
                    tipo: 'Type',
                    quantidade: 'Amount'
                }
            },
            constantesDuplicadas: {
                titulo: `${ICONES_RELATORIO.detalhado} Constants defined more than 3 times`
            },
            modulosRequire: {
                titulo: `${ICONES_RELATORIO.detalhado} require modules used more than 3 times`
            },
            fim: {
                titulo: 'End of janitor report'
            }
        },
        instrucoes: {
            diagnosticoDetalhado: 'For detailed diagnosis, run: prometheus diagnosticar --export',
            tabelasVerbosas: 'To see tables with frame in terminal (very verbose), use: --debug'
        }
    },
    padroesUso: {
        titulo: `${ICONES_DIAGNOSTICO.stats} Code Usage Patterns`
    },
    arquetipos: {
        titulo: `${ICONES_DIAGNOSTICO.arquetipos} Archetype Report`,
        secoes: {
            candidatos: {
                titulo: 'Identified Candidates',
                nome: 'Name',
                score: 'Score',
                confianca: 'Confidence',
                descricao: 'Description'
            },
            baseline: {
                titulo: 'Saved Baseline',
                snapshot: 'Snapshot',
                arquivos: 'Files'
            },
            drift: {
                titulo: 'Drift Detected',
                alterouArquetipo: 'Changed Archetype',
                deltaConfianca: 'Confidence Delta',
                arquivosNovos: 'New Files',
                arquivosRemovidos: 'Removed Files'
            }
        }
    },
    poda: {
        titulo: `${ICONES_COMANDO.podar} Prometheus Pruning Report`,
        secoes: {
            metadados: {
                data: 'Date',
                execucao: 'Execution',
                simulacao: 'Simulation',
                real: 'Real',
                arquivosPodados: 'Pruned files',
                arquivosMantidos: 'Maintained files'
            },
            podados: {
                titulo: 'Pruned Files',
                vazio: 'No files were pruned in this cycle.',
                colunas: {
                    arquivo: 'File',
                    motivo: 'Reason',
                    diasInativo: 'Days Inactive',
                    detectadoEm: 'Detected at'
                }
            },
            mantidos: {
                titulo: 'Maintained Files',
                vazio: 'No files maintained in this cycle.',
                colunas: {
                    arquivo: 'File',
                    motivo: 'Reason'
                }
            },
            pendencias: {
                titulo: 'Removal Pending',
                total: 'Total pending',
                tipoArquivo: 'Type: File',
                tipoDiretorio: 'Type: Directory',
                tamanhoTotal: 'Approximate total size'
            },
            reativacao: {
                titulo: 'Reactivation List',
                total: 'Total to reactivate'
            },
            historico: {
                titulo: 'Action History',
                total: 'Total actions',
                colunas: {
                    acao: 'Action',
                    caminho: 'Path',
                    timestamp: 'Timestamp'
                }
            }
        }
    },
    reestruturar: {
        titulo: `${ICONES_COMANDO.reestruturar} Prometheus Restructuring Report`,
        secoes: {
            metadados: {
                data: 'Date',
                execucao: 'Execution',
                simulacao: 'Simulation',
                real: 'Real',
                origemPlano: 'Plan source',
                preset: 'Preset'
            },
            movimentos: {
                titulo: 'Movements',
                total: 'Total movements',
                vazio: 'No movements suggested in this cycle.',
                status: {
                    zonVerde: 'Green Zone (safe)',
                    bloqueados: 'Blocked'
                },
                colunas: {
                    origem: 'From',
                    destino: 'To',
                    razao: 'Reason',
                    status: 'Status'
                }
            },
            conflitos: {
                titulo: 'Conflicts Detected',
                total: 'Conflicts detected',
                tipo: 'Type',
                descricao: 'Description'
            },
            preview: {
                titulo: 'Changes Preview',
                nota: 'No files will be moved until running with --apply'
            }
        }
    },
    comum: {
        separadores: {
            secao: '---',
            subsecao: '~~~'
        },
        vazios: {
            nenhumResultado: 'No results found.',
            nenhumaOcorrencia: 'No occurrences detected.',
            semDados: 'No data available.'
        },
        acoes: {
            verDetalhes: 'View full details',
            executarComando: 'Execute command',
            aplicarMudancas: 'Apply changes',
            cancelar: 'Cancel'
        }
    }
});
export function formatMessage(template, vars) {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(`{${key}}`, String(value));
    }
    return result;
}
export function pluralize(count, singular, plural, showCount = true) {
    const word = count === 1 ? singular : plural;
    return showCount ? `${count} ${word}` : word;
}
export function separator(char = '-', length = 80) {
    return char.repeat(length);
}
//# sourceMappingURL=relatorio-messages.js.map