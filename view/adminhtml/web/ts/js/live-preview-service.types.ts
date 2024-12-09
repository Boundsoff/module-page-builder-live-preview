export class SocketClient {
    constructor(
        public readonly id: string,
        public readonly storeViewCode: string,
    ) {}
}

export interface SocketMessage {
    topic: LivePreviewTopic,
    data: SocketData,
}

export interface SocketData {

}

export interface ConnectSocketData {
    readonly id: string;
    readonly storeViewCode: string;
}

export interface CloseSocketData {
    readonly id: string;
}

export interface RenderSocketData {
    readonly content: string;
}
