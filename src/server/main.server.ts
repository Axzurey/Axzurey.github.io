import { Workspace } from "@rbxts/services";
import { getSharedEnvironment } from "shared/env/environment";
import system from "shared/env/system";
import Hireg from "shared/modules/Hireg";
import World from "shared/modules/World";
/** 
const sword = Workspace.WaitForChild('Basic Longsword') as any

let register = Hireg.registerHitregForObject(sword, true);

register.activate()

Workspace.WaitForChild('homes').GetChildren().forEach((v) => {
    let m = new World.WorldEntity(v);
    World.saveEntity(m);
})*/

const env = getSharedEnvironment(); //loads the environment for the client as well

system.server.on('requestEquipWeapon', () => {})