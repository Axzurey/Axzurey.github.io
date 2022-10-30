namespace tableUtils {
    export function shallowClone<T extends any[]>(a: T): T {
        return a.map((v) => v) as T
    }
}

export = tableUtils;