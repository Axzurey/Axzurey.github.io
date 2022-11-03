import { RunService } from "@rbxts/services";
import { useValue } from "shared/modules/chroni";
import connection from "shared/modules/connection";
import { GetGenericOfClassClient, GetGenericOfClassServer } from "shared/modules/remoteProtocol";
import protocols from "./protocols";

namespace system {
    export namespace runtime {
        export const onRender = new connection<(dt: number) => void>();
        export const onStep = new connection<(t: number, dt: number) => void>();
        export const onHeartbeat = new connection<(dt: number) => void>();

        const timeStep = useValue(1); //default is 1x time speed.

        const timePaused = useValue(false);

        if (RunService.IsClient()) {
            const renderConnection = RunService.RenderStepped.Connect((dt) => {
                if (timePaused.getValue()) return;
                onRender.fire(dt * timeStep.getValue());
            })
        }

        const stepConnection = RunService.Stepped.Connect((t, dt) => {
            if (timePaused.getValue()) return;
            onStep.fire(t, dt * timeStep.getValue())
        })

        const heartbeatConnection = RunService.Heartbeat.Connect((dt) => {
            if (timePaused.getValue()) return;
            onHeartbeat.fire(dt * timeStep.getValue());
        })
    }

    export namespace client {
        export function invokeProtocol<T extends keyof typeof protocols>(
            protocol: T, ...args: Parameters<GetGenericOfClassClient<(typeof protocols)[T]["protocol"]>>) {
            if (RunService.IsServer()) throw `protocol ${protocol} can not be invoked from the server!`;

            protocols[protocol].protocol.fireServer(args as never);
        }
        export function on<T extends keyof typeof protocols>(protocol: T, callback: GetGenericOfClassClient<(typeof protocols[T])['protocol']>) {
            if (RunService.IsServer()) throw `protocol ${protocol} can not be listened to from the server!`;
            return protocols[protocol].protocol.listenClient(callback as never);
        }
    }
    export namespace server {
        export function invokeProtocol<T extends keyof typeof protocols>(
            protocol: T, client: Player, ...args: Parameters<GetGenericOfClassServer<(typeof protocols)[T]["protocol"]>>) {
            if (RunService.IsClient()) throw `protocol ${protocol} can not be invoked from the client!`;

            protocols[protocol].protocol.fireClient(client, args as never);
        }
        export function on<T extends keyof typeof protocols>(protocol: T, callback: GetGenericOfClassServer<(typeof protocols[T])['protocol']>) {
            if (RunService.IsClient()) throw `protocol ${protocol} can not be listened to from the client!`;
            return protocols[protocol].protocol.listenServer(callback as never);
        }
    }
}

export default system;