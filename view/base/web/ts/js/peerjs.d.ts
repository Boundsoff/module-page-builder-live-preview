declare class AbstractPeer {
    on(event: string, handler: () => void): void;
}

declare class Peer extends AbstractPeer {
    constructor()

    id: string;
    open: boolean;

    connect(peerId: string): DataConnection;

    disconnect(): void;
}

declare class DataConnection extends AbstractPeer {
    send(data: object): void;
    close(): void;
}
