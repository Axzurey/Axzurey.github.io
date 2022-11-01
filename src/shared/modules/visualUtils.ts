import { Workspace } from "@rbxts/services";

namespace visualUtils {

    export function generateRandomColor3() {
        return new Color3(math.random(), math.random(), math.random())
    }

    const visualPart = new Instance('Part');
    visualPart.Transparency = 1;
    visualPart.Size = new Vector3()
    visualPart.Anchored = true;
    visualPart.CanTouch = false;
    visualPart.CanCollide = false;
    visualPart.CanQuery = false;
    visualPart.Position = new Vector3(0, 10000, 0)
    visualPart.Parent = Workspace;

    export function drawBeamLine(p0: Vector3, p1: Vector3, lifeTime: number) {
        let b = new Instance("Beam");
        
        let a0 = new Instance('Attachment');
        let a1 = new Instance('Attachment');

        a0.Parent = visualPart;
        a1.Parent = visualPart;
        b.Parent = visualPart;

        a0.WorldPosition = p0;
        a1.WorldPosition = p1;

        b.Attachment0 = a0;
        b.Attachment1 = a1;

        b.Color = new ColorSequence(generateRandomColor3());

        b.Transparency = new NumberSequence(0)

        b.FaceCamera = true;
        b.Width0 = .2;
        b.Width1 = .2;
        b.LightEmission = 100;

        task.delay(lifeTime, () => {
            b.Destroy();
            a0.Destroy();
            a1.Destroy();
        })
    }
}

export default visualUtils;