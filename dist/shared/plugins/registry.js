import { ExcecoesMensagens } from '../../core/messages/core/excecoes-messages.js';
import { log, logCore } from '../../core/messages/index.js';
export class PluginRegistry {
    plugins = new Map();
    extensionMap = new Map();
    config;
    userConfiguredEnabled = false;
    languageSupport;
    loadingPromises = new Map();
    constructor(config, languageSupport) {
        this.config = {
            enabled: ['core'],
            autoload: true,
            registry: '@prometheus/plugins',
            ...config
        };
        this.userConfiguredEnabled = !!config?.enabled;
        this.languageSupport = languageSupport || {};
    }
    registerPlugin(plugin) {
        logCore.registrandoPlugin(plugin.name, plugin.version);
        this.validatePlugin(plugin);
        this.plugins.set(plugin.name, plugin);
        for (const ext of plugin.extensions) {
            if (this.extensionMap.has(ext)) {
                const existing = this.extensionMap.get(ext);
                log.debug(`⚠️ Extensão ${ext} já mapeada para plugin ${existing}, sobrescrevendo com ${plugin.name}`);
            }
            this.extensionMap.set(ext, plugin.name);
        }
        log.debug(`✅ Plugin ${plugin.name} registrado com extensões: ${plugin.extensions.join(', ')}`);
    }
    async loadPlugin(name) {
        if (this.plugins.has(name)) {
            const plugin = this.plugins.get(name);
            if (!plugin) {
                throw new Error(ExcecoesMensagens.pluginRegistradoNaoPodeSerObtido(name));
            }
            return plugin;
        }
        if (this.loadingPromises.has(name)) {
            const promise = this.loadingPromises.get(name);
            if (!promise) {
                throw new Error(ExcecoesMensagens.pluginCarregandoPromiseNaoPodeSerObtida(name));
            }
            return promise;
        }
        const loadingPromise = this.doLoadPlugin(name);
        this.loadingPromises.set(name, loadingPromise);
        try {
            const plugin = await loadingPromise;
            this.loadingPromises.delete(name);
            return plugin;
        }
        catch (error) {
            this.loadingPromises.delete(name);
            throw error;
        }
    }
    async doLoadPlugin(name) {
        log.debug(`📦 Carregando plugin: ${name}`);
        try {
            const pluginCaminho = `${this.config.registry}/${name}-plugin`;
            const dynImport = globalThis.import || ((p) => import(p));
            const pluginModule = await dynImport(pluginCaminho);
            const plugin = pluginModule.default || pluginModule;
            this.validatePlugin(plugin);
            this.registerPlugin(plugin);
            return plugin;
        }
        catch (error) {
            logCore.erroCarregarPlugin(name, error.message);
            throw new Error(ExcecoesMensagens.naoFoiPossivelCarregarPlugin(name, error.message));
        }
    }
    async getPluginForExtension(extension) {
        const pluginNome = this.extensionMap.get(extension);
        if (!pluginNome) {
            if (this.config.autoload) {
                logCore.tentandoAutoload(extension);
                const inferredNome = this.inferPluginName(extension);
                if (inferredNome && this.config.enabled.includes(inferredNome)) {
                    try {
                        return await this.loadPlugin(inferredNome);
                    }
                    catch {
                        logCore.autoloadFalhou(inferredNome);
                    }
                }
            }
            return null;
        }
        if (this.userConfiguredEnabled && !this.config.enabled.includes(pluginNome)) {
            log.debug(`🚫 Plugin ${pluginNome} está desabilitado para extensão ${extension}`);
            return null;
        }
        const langChave = extension.substring(1);
        const langSuporte = this.languageSupport[langChave];
        if (langSuporte && !langSuporte.enabled) {
            log.debug(`🚫 Suporte à linguagem ${langChave} está desabilitado`);
            return null;
        }
        return await this.loadPlugin(pluginNome);
    }
    inferPluginName(extension) {
        const extMap = {
            '.xml': 'core',
            '.html': 'core',
            '.htm': 'core',
            '.css': 'core',
            '.js': 'core',
            '.jsx': 'core',
            '.ts': 'core',
            '.tsx': 'core',
            '.mjs': 'core',
            '.cjs': 'core',
            '.php': 'core',
            '.py': 'core'
        };
        return extMap[extension] || null;
    }
    validatePlugin(plugin) {
        if (!plugin.name || typeof plugin.name !== 'string') {
            throw new Error(ExcecoesMensagens.pluginDeveTerNomeValido);
        }
        if (!plugin.version || typeof plugin.version !== 'string') {
            throw new Error(ExcecoesMensagens.pluginDeveTerVersaoValida);
        }
        if (!Array.isArray(plugin.extensions) || plugin.extensions.length === 0) {
            throw new Error(ExcecoesMensagens.pluginDeveDefinirPeloMenosUmaExtensao);
        }
        if (typeof plugin.parse !== 'function') {
            throw new Error(ExcecoesMensagens.pluginDeveImplementarMetodoParse);
        }
    }
    getRegisteredPlugins() {
        return Array.from(this.plugins.keys());
    }
    getSupportedExtensions() {
        return Array.from(this.extensionMap.keys());
    }
    getStats() {
        return {
            pluginsRegistrados: this.plugins.size,
            extensoesSuportadas: this.extensionMap.size,
            pluginsHabilitados: this.config.enabled.length,
            autoloadAtivo: this.config.autoload
        };
    }
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        if (Object.prototype.hasOwnProperty.call(newConfig, 'enabled')) {
            this.userConfiguredEnabled = true;
        }
        log.debug(`🔧 Configuração do registry atualizada`);
    }
    updateLanguageSupport(newSupport) {
        this.languageSupport = {
            ...this.languageSupport,
            ...newSupport
        };
        log.debug(`🌐 Suporte a linguagens atualizado`);
    }
    clearCache() {
        this.plugins.clear();
        this.extensionMap.clear();
        this.loadingPromises.clear();
        log.debug(`🧹 Cache do registry limpo`);
    }
}
let globalRegistro = null;
export function getGlobalRegistry() {
    if (!globalRegistro) {
        globalRegistro = new PluginRegistry();
    }
    return globalRegistro;
}
export function configureGlobalRegistry(config, languageSupport) {
    globalRegistro = new PluginRegistry(config, languageSupport);
}
export function resetGlobalRegistry() {
    globalRegistro = null;
}
//# sourceMappingURL=registry.js.map