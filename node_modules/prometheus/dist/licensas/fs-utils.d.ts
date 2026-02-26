export declare function exists(p: string): boolean;
export declare function readPackageJsonSync(pkgCaminho: string): Record<string, unknown> | null;
export declare function findLicenseFile(dir: string): {
    file: string;
    path: string;
    text: string | null;
} | null;
//# sourceMappingURL=fs-utils.d.ts.map