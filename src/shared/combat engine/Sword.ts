import { getClient, getClientCharacter } from "shared/env/environment";
import system from "shared/env/system";
import path from "shared/modules/path";
import { animationCompiler } from "shared/modules/sweep";
import { peripherals } from "shared/modules/utils";
import CombatEngine from "./CombatEngine";
import { Weapon } from "./Weapon";

type SwordWeapon = Model & {
    blade: BasePart
    handle: BasePart
}

interface SwordAnimationsID {
    idle: string,
    swing1: string
}

type SwordAnimations = Partial<{[k in keyof SwordAnimationsID]: AnimationTrack}>

export abstract class Sword extends Weapon<SwordWeapon> {
    damage: number = 20;
    animations: SwordAnimations = {};

    lastAttack: number = tick()

    constructor(private ctx: CombatEngine, modelPath: string, animations: Partial<SwordAnimationsID>) {
        const model = path.sure(modelPath) as SwordWeapon;

        super(model);

        const pAnims: SwordAnimations = {};

        let character = getClientCharacter();

        if (!character) throw `Player's character hasn't loaded yet...`

        for (const [k, animation] of pairs(animations)) {
            let p = animationCompiler.create(animation);

            const animator = character.WaitForChild('Humanoid').WaitForChild('Animator') as Animator;

            pAnims[k] = animator.LoadAnimation(p.get());

            p.cleanUp();
        }

        this.animations = pAnims;

        this.model.Parent = character;

        let m6d = new Instance('Motor6D');
        m6d.Part0 = character.FindFirstChild('UpperTorso') as BasePart;
        m6d.Part1 = this.model.handle;
        m6d.Parent = this.model.handle;

        system.runtime.onRender.connect((dt) => this.update(dt));
    }

    attack() {
        if (tick() - this.lastAttack > 1.5) {
            this.lastAttack = tick();

            this.animations.swing1?.Play();
        }
    }

    update(dt: number) {
        if (this.animations.idle && !this.animations.idle.IsPlaying) {
            this.animations.idle.Play();
        }

        if (peripherals.isButtonDown(this.ctx.keybinds.attack)) {
            this.attack()
        }
    }
}

export class BasicLongsword extends Sword {
    constructor(ctx: CombatEngine, modelPath: string, animations: SwordAnimationsID) {
        super(ctx, modelPath, animations);
    }
}