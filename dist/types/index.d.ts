import Net, { NetOptions } from './net';
import OSS from './oss';
export interface SDKUtilsOptions extends NetOptions {
}
export default class SDKUtils {
    net: Net;
    oss: OSS;
    constructor(options: SDKUtilsOptions);
    /**
     *
     * @param file File 文件对象
     * @returns data { url, size, type }
     */
    upload(file: File): Promise<{
        url: any;
        size: number;
        type: string;
    }>;
}
