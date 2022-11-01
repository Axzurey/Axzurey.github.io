import { Sword } from "./Sword";

export default class CombatEngine {

    weapons: Sword[] = [];

    currentWeaponIndex: number = 0;

    getWeapon() {
        return this.weapons[this.currentWeaponIndex];
    }

    constructor() {}
}