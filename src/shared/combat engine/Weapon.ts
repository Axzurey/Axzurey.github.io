export abstract class Weapon<T extends Model> {
    constructor(public model: T) {}
}