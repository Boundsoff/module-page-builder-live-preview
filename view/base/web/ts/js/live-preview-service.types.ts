export interface SocketClient {
    storeViewCode: string;
}

export interface SocketMessage {
    topic: string,
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
