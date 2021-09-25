import Net from './net';
export default class OSS {
    net: Net;
    constructor(net: Net);
    getPolicy(ext?: string): Promise<any>;
    upload(file: File, policy: any): Promise<{
        url: any;
        size: number;
        type: string;
    }>;
}
