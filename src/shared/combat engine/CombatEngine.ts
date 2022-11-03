import { BasicLongsword, Sword } from "./Sword";

export default class CombatEngine {

    weapons: Sword[] = [];

    currentWeaponIndex: number = 0;

    keybinds = {
        attack: Enum.UserInputType.MouseButton1
    }

    getWeapon() {
        return this.weapons[this.currentWeaponIndex];
    }

    constructor() {
        task.wait(3);
        const firstSword = new BasicLongsword(this, 'ReplicatedStorage//weapons//Basic Longsword&Model', {
            idle: 'rbxassetid://11456767438',
            swing1: 'rbxassetid://11456987689'
        })
    }
}