export interface DisclaimerOptions {
    root?: string;
    disclaimerPath?: string;
    dryRun?: boolean;
}
export declare function addDisclaimer({ root, disclaimerPath, dryRun }?: DisclaimerOptions): Promise<{
    updatedArquivos: string[];
}>;
export declare function verifyDisclaimer({ root, disclaimerPath }?: Pick<DisclaimerOptions, 'root' | 'disclaimerPath'>): Promise<{
    missing: string[];
}>;
declare const disclaimerModule: {
    addDisclaimer: typeof addDisclaimer;
    verifyDisclaimer: typeof verifyDisclaimer;
};
export default disclaimerModule;
//# sourceMappingURL=disclaimer.d.ts.map