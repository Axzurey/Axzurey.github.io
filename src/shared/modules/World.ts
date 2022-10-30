namespace World {
    export class WorldEntity {
        constructor(public instance: Instance) {}
    }

    export abstract class WorldRegistry {
        static entities: WorldEntity[] = [];
    }
}

export = World;