export default class HealthImage {
    file: File;
    constructor(file: File);
    fixIOSRotate(): Promise<File>;
    getImage(): Promise<HTMLImageElement>;
    getTag(tag: any): Promise<unknown>;
    dataUriToFile(dataUri: string): File;
}
