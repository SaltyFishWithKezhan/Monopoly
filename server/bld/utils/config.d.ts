export declare type keys<T> = T extends object ? keyof T : never;
export declare class ConfigService<T extends object> {
    private readonly data;
    constructor(filePath: string);
    get(): T;
    get<K extends keys<T>>(key: K): T[K] | undefined;
    get<K extends keys<T>>(key: K, fallback: T[K]): T[K];
}
export interface ServerConfig {
    port: number;
}
export declare class Config {
    static server: ConfigService<ServerConfig>;
}
