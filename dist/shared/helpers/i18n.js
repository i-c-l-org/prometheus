import { config } from '../../core/config/config.js';
export function i18n(messages) {
    const lang = config.LANGUAGE || 'pt-BR';
    return messages[lang] || messages['pt-BR'];
}
export function createI18nMessages(pt, en) {
    return new Proxy(pt, {
        get(target, prop, receiver) {
            const lang = config.LANGUAGE || 'pt-BR';
            if (lang === 'en' && en[prop]) {
                return en[prop];
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}
//# sourceMappingURL=i18n.js.map