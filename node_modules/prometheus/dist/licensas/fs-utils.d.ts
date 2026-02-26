export declare function existsSync(p: string): boolean;
export declare function existsAsync(p: string): Promise<boolean>;
export declare function readPackageJsonSync(pkgCaminho: string): Record<string, unknown> | null;
export declare function readPackageJson(pkgCaminho: string): Promise<Record<string, unknown> | null>;
export declare function findLicenseFile(dir: string): {
    file: string;
    path: string;
    text: string | null;
} | null;
export declare function findLicenseFileAsync(dir: string): Promise<{
    file: string;
    path: string;
    text: string | null;
} | null>;
//# sourceMappingURL=fs-utils.d.ts.map