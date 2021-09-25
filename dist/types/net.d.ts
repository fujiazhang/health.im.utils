export interface NetOptions {
    getToken: () => string;
    prefix?: string;
}
export interface NetFetchRequest {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: BodyInit | null;
}
export default class Net {
    getToken: () => string;
    prefix: string;
    constructor(options: NetOptions);
    fetch(request: NetFetchRequest): Promise<Response>;
}
