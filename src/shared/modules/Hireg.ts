import { RunService, Workspace } from "@rbxts/services";
import { shallowClone } from "./tableUtils";
import World, { WorldEntity } from "./World";

namespace Hireg {

    type ColliderType = 'Polygon' | 'Point'

    type HitBufferType = Map<WorldEntity, true>

    type HitRegistrableObject = Model & {
        hitMarkers: Folder & {[k in ColliderType]: Attachment} //naturally, k would be the instance name
    }

    type IsObjectIgnoredCallback = (hit: BasePart) => boolean

    class HiPoint {
        lastRegistry: Vector3
        constructor(public point: Attachment) {
            this.lastRegistry = point.WorldPosition;
        }

        updateCheck(searchList: World.WorldEntity[], hitBuffer: HitBufferType): [RaycastResult, World.WorldEntity] | undefined {
            const ignoreParams = new RaycastParams()
            ignoreParams.FilterDescendantsInstances = searchList.map((v) => v.instance);
            
            let result = Workspace.Raycast(this.lastRegistry, this.point.WorldPosition, ignoreParams);
        
            if (!result) return;

            for (let v of searchList) {
                if (result.Instance.IsDescendantOf(v.instance)) {
                    if (hitBuffer.get(v)) return;
                    hitBuffer.set(v, true);
                    return [result, v];
                }
            }
        }
    }

    class HiPoly {
        constructor(public points: Attachment[]) {

        }

        updateCheck(ignore: IsObjectIgnoredCallback) {
            
        }
    }

    class HiregRegister {
        active: boolean = false;

        hitBuffer: HitBufferType = new Map()

        constructor(public points: HiPoint[]) {}

        /**
         * Activates for t length of time
         */
        activateFor(t: number) {
            task.delay(t, () => this.active = false);
            
            this.activate();
        }

        activate() {
            this.hitBuffer.clear();
            this.active = true;

            let hasConnected = false;
            
            let step = RunService.Heartbeat.Connect((dt) => {
                if (hasConnected) {step.Disconnect(); return;}
                for (let point of this.points) {
                    point.updateCheck(shallowClone(World.WorldRegistry.entities), this.hitBuffer)
                }
            })
        }

        deactivate() {this.active = true;}
    }

    export function registerHitregForObject<T extends HitRegistrableObject>(object: T) {
        let points: HiPoint[] = [];

        object.hitMarkers.GetChildren().forEach((v) => {
            if (!v.IsA('Attachment')) return;
            points.push(new HiPoint(v));
        })

        let hitRegister = new HiregRegister(points);
        
        return hitRegister;
    }
}

export default Hireg;

//TODO: FIGURE OUT HOW YOU'RE GOING TO DO POLYGONAL HITREGISTRATION