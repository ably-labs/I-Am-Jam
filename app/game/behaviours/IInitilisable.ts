export interface IInitialisable {
    init(): Promise<void>;
}

export function isInitialisable(obj: any): obj is IInitialisable {
    return "init" in obj;
}
