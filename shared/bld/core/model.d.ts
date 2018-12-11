export declare class Model<T extends object = {}> {
    readonly id: string;
    data: T | {};
    constructor(id?: string, data?: T);
}
