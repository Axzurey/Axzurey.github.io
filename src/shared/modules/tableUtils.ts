namespace tableUtils {
    export function shallowClone<T extends any[]>(a: T): T {
        return a.map((v) => v) as T
    }
    /**
     * add all items in t1 to t0
     */
    export function spreadFill<T extends any[], E extends any[]>(t0: T, t1: E): T & E {
        t1.forEach(v => t0.push(v))
        return t0 as T & E;
    }
}

export = tableUtils;