import { Weapon } from "./Weapon";

type SwordWeapon = Model & {
    blade: BasePart
    handle: BasePart
}

export abstract class Sword extends Weapon<SwordWeapon> {

}