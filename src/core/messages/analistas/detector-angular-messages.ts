// SPDX-License-Identifier: MIT

import { createI18nMessages } from '@shared/helpers/i18n.js';

export const DetectorAngularMensagens = createI18nMessages({
  vazamentoMemoriaSubscription: (nome: string) => `🚨 Potencial vazamento de memória: Subscription '${nome}' detectada sem cleanup aparente no ngOnDestroy.`,
  trackByObrigatorio: '🚀 Performance: *ngFor detectado sem trackBy. Isso pode causar problemas de performance ao renderizar listas grandes.',
  renderer2Sugerido: "🛡️ Segurança/Arquitetura: Manipulação direta do DOM detectada. Use 'Renderer2' ou 'ElementRef' para manter a abstração do Angular.",
  logicaNoConstrutor: '🏗️ Arquitetura: Lógica detectada no constructor. Prefira usar o hook ngOnInit para inicializações complexas.',
  signalSugerido: (nome: string) => `💡 Sugestão (Angular Moderno): Atributo '${nome}' poderia ser um Signal para melhor performance e reatividade.`,
  logicaTemplateExcessiva: '🧩 Template: Excesso de lógica complexa detectada no template. Considere mover para propriedades calculadas ou métodos no componente.',
  onPushSugerido: '⚡ Performance: Considere usar ChangeDetectionStrategy.OnPush para este componente.'
}, {
  vazamentoMemoriaSubscription: (nome: string) => `🚨 Potential memory leak: Subscription '${nome}' detected without apparent cleanup in ngOnDestroy.`,
  trackByObrigatorio: '🚀 Performance: *ngFor detected without trackBy. This can cause performance issues when rendering large lists.',
  renderer2Sugerido: "🛡️ Security/Architecture: Direct DOM manipulation detected. Use 'Renderer2' or 'ElementRef' to maintain Angular's abstraction.",
  logicaNoConstrutor: '🏗️ Architecture: Logic detected in the constructor. Prefer using the ngOnInit hook for complex initializations.',
  signalSugerido: (nome: string) => `💡 Suggestion (Modern Angular): Attribute '${nome}' could be a Signal for better performance and reactivity.`,
  logicaTemplateExcessiva: '🧩 Template: Excessive complex logic detected in the template. Consider moving to computed properties or methods in the component.',
  onPushSugerido: '⚡ Performance: Consider using ChangeDetectionStrategy.OnPush for this component.'
});
