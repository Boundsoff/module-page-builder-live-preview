// @ts-ignore
import events from "Magento_PageBuilder/js/events";
import PageBuilderInterface from "Magento_PageBuilder/js/page-builder.types";
import {
    RegisterSocketData,
    SocketClient,
    SocketMessage
} from "Boundsoff_PageBuilderLivePreview/js/live-preview-service.types";

export default class {
    protected readonly peer: Peer;
    protected readonly clients: Map<DataConnection, SocketClient> = new Map();

    get peerId(): string {
        return this.peer.id;
    }

    constructor(
        protected readonly pageBuilder: PageBuilderInterface,
    ) {
        window.addEventListener('beforeunload', () => {
            Array.from(this.clients.keys())
                .forEach((connection => connection.close()));

            this.clients.clear();
            this.peer.disconnect();
        }, { passive: true });

        this.peer = new Peer();
        this.peer.on('connection', this.connect.bind(this));

        events.on(
            `stage:${ this.pageBuilder.stage.id }:masterFormatRenderAfter`,
            this.afterMasterFormatRender.bind(this),
        );
    }

    public connect(connection: DataConnection): void {
        if (this.clients.has(connection)) {
            console.warn('already got this socket client');
        }

        connection.on('open', () => {
            connection.on('data', this.data.bind(this, connection));
        })

        this.clients.set(connection, { storeViewCode: '-' });
    }

    public data(connection: DataConnection, data: SocketMessage): void {
        switch (data.topic) {
            case LivePreviewTopic.register:
                this.onRegister(connection, <RegisterSocketData>data.data);
                break;
            case LivePreviewTopic.close:
                this.onClose(connection);
                break;
            default:
                console.warn(`Undefined socket message type.`);
                break;
        }
    }

    protected afterMasterFormatRender({ value }: { value: string}): void {
        if (!this.clients.size || !this.peer.open) {
            return;
        }

        const socketMessage: SocketMessage = { topic: LivePreviewTopic.render, data: { value } }
        Array.from(this.clients.keys())
            .forEach(connection => connection.send(socketMessage));
    }

    protected onRegister(connection: DataConnection, data: RegisterSocketData): void {
        const client = this.clients.get(connection);
        client.storeViewCode = data.storeViewCode;
    }

    protected onClose(connection: DataConnection): void {
        this.clients.delete(connection);
        connection.close();
    }
}
