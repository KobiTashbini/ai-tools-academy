export type Query = (sql: string) => Promise<Record<string, any>[]>;
export function connectionConfig(env?: Record<string, string | undefined>): Record<string, unknown>;
export function readOnlyTransaction<T>(work: (query: Query) => Promise<T>): Promise<T>;
export function closePool(): Promise<void>;
