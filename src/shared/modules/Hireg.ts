import { RunService, Workspace } from "@rbxts/services";
import { shallowClone, spreadFill } from "./tableUtils";
import visualUtils from "./visualUtils";
import World, { WorldEntity, WorldRegistry } from "./World";

namespace Hireg {

    type ColliderType = 'Polygon' | 'Point'

    type HitBufferType = Map<WorldEntity, true>

    type HitRegistrableObject = Model & {
        blade: Model & {[k in ColliderType]: Attachment} //naturally, k would be the instance name
    }

    type IsObjectIgnoredCallback = (hit: BasePart) => boolean

    function rayCheck(p0: Vector3, p1: Vector3, searchList: World.WorldEntity[], hitBuffer: HitBufferType): [RaycastResult, World.WorldEntity] | undefined {
        const ignoreParams = new RaycastParams()
        ignoreParams.FilterType = Enum.RaycastFilterType.Whitelist;
        ignoreParams.FilterDescendantsInstances = searchList.map((v) => v.instance);
        
        let result = Workspace.Raycast(p0, p1.sub(p0), ignoreParams);
    
        if (!result) return;

        for (let v of searchList) {
            if (result.Instance.IsDescendantOf(v.instance)) {
                if (hitBuffer.get(v)) return;
                hitBuffer.set(v, true);
                return [result, v];
            }
        }
    }

    function repeatRaycheckTillNull(p0: Vector3, p1: Vector3, searchList: World.WorldEntity[], hitBuffer: HitBufferType): [RaycastResult, WorldEntity][] {
        let results: [RaycastResult, WorldEntity][] = [];
        
        while (true) {
            let result = rayCheck(p0, p1, searchList, hitBuffer);

            if (!result) break;

            searchList.remove(searchList.indexOf(result[1]));

            results.push(result)
        }

        return results;
    }

    class HiPoint {
        lastRegistry: Vector3
        constructor(public point: Attachment) {
            this.lastRegistry = point.WorldPosition;
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

        constructor(public points: HiPoint[], private onHit: (entity: World.WorldEntity) => void, private debug: boolean) {}

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
                
                for (let [i, point] of pairs(this.points)) {

                    let differences: [Vector3, Vector3][] = [[point.point.WorldPosition, point.lastRegistry]];

                    if (i < this.points.size()) {
                        differences.push([point.lastRegistry, this.points[i].point.WorldPosition]);
                        differences.push([point.point.WorldPosition, this.points[i].point.WorldPosition]);
                    }
                    
                    let res: [RaycastResult, WorldEntity][] = []

                    differences.forEach((v) => {
                        let r = repeatRaycheckTillNull(v[0], v[1], World.WorldRegistry.entities, this.hitBuffer);
                        
                        r.forEach(v => res.push(v));

                        if (this.debug) {
                            visualUtils.drawBeamLine(v[0], v[1], .5);
                        }
                    })

                    point.lastRegistry = point.point.WorldPosition;

                    res.forEach((v) => {
                        this.onHit(v[1])
                    })
                }
                
            })
        }

        deactivate() {this.active = true;}
    }

    export function registerHitregForObject<T extends HitRegistrableObject>(object: T, debug: boolean = false) {
        let points: HiPoint[] = [];

        object.blade.GetChildren().forEach((v) => {
            if (!v.IsA('Attachment')) return;
            points.push(new HiPoint(v));
        })

        let hitRegister = new HiregRegister(points, (v) => {
            print(v.instance.Name)
        }, debug);
        
        return hitRegister;
    }
}

export default Hireg;

//TODO: FIGURE OUT HOW YOU'RE GOING TO DO POLYGONAL HITREGISTRATION