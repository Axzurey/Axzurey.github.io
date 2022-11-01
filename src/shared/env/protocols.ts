import { t } from "@rbxts/t";
import remoteProtocol from "shared/modules/remoteProtocol";

const protocols = {
    requestEquipWeapon: {
        protocol: new remoteProtocol<(player: Player, identifier: string) => void, (identifier: string) => void>
        ('requestEquipWeapon', [t.instanceOf('Player'), t.string])
    }
}

export default protocols;