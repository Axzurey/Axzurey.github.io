export abstract class Weapon<T extends Model> {
    constructor(private model: T) {}
}