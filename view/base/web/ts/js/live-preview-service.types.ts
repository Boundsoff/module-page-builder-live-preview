export interface SocketClient {
    storeViewCode: string;
}

export interface SocketMessage {
    topic: LivePreviewTopic,
    data?: SocketData,
}

export interface SocketData {

}

export interface RegisterSocketData {
    readonly storeViewCode: string;
}

export interface RenderSocketData {
    readonly content: string;
}
