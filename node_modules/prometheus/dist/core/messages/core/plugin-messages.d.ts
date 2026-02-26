export declare const ReactMensagens: {
    linkTargetBlank: string;
    dangerouslySetInnerHTML: string;
    imgWithoutAlt: string;
    httpFetch: string;
    hardcodedCredential: string;
    locationHrefRedirect: string;
    listItemNoKey: string;
    indexAsKey: string;
    inlineHandlerJsx: string;
};
export declare const ReactHooksMensagens: {
    useEffectNoDeps: string;
    memoCallbackNoDeps: string;
    hookInConditional: string;
};
export declare const TailwindMensagens: {
    conflictingClasses: (key: string, tokens: string[]) => string;
    repeatedClass: (token: string) => string;
    importantUsage: (token: string) => string;
    variantConflict: (prop: string, variants: string[]) => string;
    dangerousArbitraryValue: (token: string) => string;
    arbitraryValue: (token: string) => string;
};
export declare const CssMensagens: {
    duplicatePropertySame: (prop: string) => string;
    duplicatePropertyDifferent: (prop: string, prev: string, curr: string) => string;
    importantUsage: string;
    httpImport: string;
    httpUrl: string;
    unifySelectors: (selectors: string[], propsCount: number) => string;
    idSelectorPreferClass: (selector: string) => string;
    invalidProperty: (prop: string) => string;
    malformedSelector: (selector: string) => string;
    emptyRule: string;
    vendorPrefixDeprecated: (prop: string) => string;
    cssHackDetected: (hack: string) => string;
};
export declare const HtmlMensagens: {
    doctype: string;
    htmlLang: string;
    metaCharset: string;
    viewport: string;
    title: string;
    linkTargetBlank: string;
    linkNoHref: string;
    imgWithoutAlt: string;
    imgWithoutLoading: string;
    imgWithoutDimensions: string;
    formWithoutMethod: string;
    formWithoutAction: string;
    inputWithoutLabel: string;
    passwordWithoutAutocomplete: string;
    inputWithoutType: string;
    inlineHandler: string;
    inlineScript: string;
    inlineStyle: string;
    scriptWithoutDefer: string;
    headingSkipped: (current: number, expected: number) => string;
    buttonWithoutText: string;
    tableWithoutCaption: string;
    iframeWithoutTitle: string;
    largeInlineScript: string;
    multipleH1: string;
};
export declare const XmlMensagens: {
    xmlPrologAusente: string;
    doctypeDetectado: string;
    doctypeExternoDetectado: string;
    entidadeDetectada: string;
    entidadeExternaDetectada: string;
    entidadeParametroDetectada: string;
    xincludeDetectado: string;
    namespaceUndeclared: (prefix: string) => string;
    invalidXmlStructure: string;
    encodingMismatch: (declared: string, detected: string) => string;
    largeEntityExpansion: string;
    cdataInAttribute: string;
};
export declare const FormatadorMensagens: {
    naoFormatado: (parser: string, detalhes?: string) => string;
    parseErro: (parser: string, err: string) => string;
};
export declare const SvgMensagens: {
    naoPareceSvg: string;
    semViewBox: string;
    scriptInline: string;
    eventoInline: string;
    javascriptUrl: string;
    podeOtimizar: (originalBytes: number, optimizedBytes: number, mudancas: string[]) => string;
};
export declare const CssInJsMensagens: {
    detectedStyledComponents: string;
    detectedStyledJsx: string;
    globalStyles: (fonte: "styled-components" | "styled-jsx") => string;
    importantUsage: string;
    httpUrl: string;
};
export declare const PythonMensagens: {
    missingTypeHints: string;
    hardcodedString: (string: string) => string;
    httpWithoutVerify: string;
    sqlInjection: string;
    broadExcept: string;
    bareRaise: string;
    passInExcept: string;
    printInsteadOfLog: string;
    evalUsage: string;
    execUsage: string;
    subprocessShellTrue: string;
    pickleUsage: string;
    yamlUnsafeLoad: string;
    globalKeyword: string;
    mutableDefault: string;
    listComprehensionOpportunity: string;
    loopingOverDict: string;
};
export declare const SeverityNiveis: {
    error: string;
    warning: string;
    info: string;
    suggestion: string;
};
export declare const AnalystTipos: {
    readonly react: "react/regra";
    readonly reactHooks: "react-hooks/regra";
    readonly tailwind: "tailwindcss/regra";
    readonly css: "css/regra";
    readonly html: "html/regra";
    readonly python: "python/regra";
    readonly xml: "xml/regra";
    readonly formatador: "formatador/regra";
    readonly svg: "svg/regra";
    readonly cssInJs: "css-in-js/regra";
};
export declare const AnalystOrigens: {
    readonly react: "analista-react";
    readonly reactHooks: "analista-react-hooks";
    readonly tailwind: "analista-tailwind";
    readonly css: "analista-css";
    readonly html: "analista-html";
    readonly python: "analista-python";
    readonly xml: "analista-xml";
    readonly formatador: "analista-formatador";
    readonly svg: "analista-svg";
    readonly cssInJs: "analista-css-in-js";
};
//# sourceMappingURL=plugin-messages.d.ts.map