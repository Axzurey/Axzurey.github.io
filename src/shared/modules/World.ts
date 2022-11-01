namespace World {
    export class WorldEntity {
        constructor(public instance: Instance) {}
    }

    export function saveEntity(e: WorldEntity) {
        WorldRegistry.entities.push(e)
    }

    export function entityHasProperty<T extends any, E extends WorldEntity, P extends string>(entity: E, property: P): entity is E & {[k in P]: T} {
        if (property in entity) return true;
        return false;
    }

    export abstract class WorldRegistry {
        static entities: WorldEntity[] = [];
    }

    let c = new WorldEntity(new Instance("Model"))

    if (entityHasProperty(c, 'hello', Color3)) {
        
    }
}

export = World;