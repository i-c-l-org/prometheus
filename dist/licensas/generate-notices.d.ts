export interface GenerateNoticesOptions {
    root?: string;
    ptBr?: boolean;
    output?: string;
}
export declare function generateNotices({ root, ptBr, output }?: GenerateNoticesOptions): Promise<{
    output: string;
    packages: number;
}>;
export default generateNotices;
//# sourceMappingURL=generate-notices.d.ts.map