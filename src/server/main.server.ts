import { Workspace } from "@rbxts/services";
import Hireg from "shared/modules/Hireg";
import World from "shared/modules/World";

const sword = Workspace.WaitForChild('Basic Longsword') as any

let register = Hireg.registerHitregForObject(sword, true);

register.activate()

Workspace.WaitForChild('homes').GetChildren().forEach((v) => {
    let m = new World.WorldEntity(v);
    World.saveEntity(m);
})