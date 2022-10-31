namespace World {
    export class WorldEntity {
        constructor(public instance: Instance) {}
    }

    export function saveEntity(e: WorldEntity) {
        WorldRegistry.entities.push(e)
    }

    export abstract class WorldRegistry {
        static entities: WorldEntity[] = [];
    }
}

export = World;