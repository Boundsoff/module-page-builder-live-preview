// @ts-ignore
import events from "Magento_PageBuilder/js/events";
import ko from 'knockout';
import $ from "jquery";
import PageBuilderInterface from "Magento_PageBuilder/js/page-builder.types";
import {
    RegisterSocketData, RenderSocketData,
    SocketClient,
    SocketMessage
} from "Boundsoff_PageBuilderLivePreview/js/live-preview-service.types";
import Config from "Magento_PageBuilder/js/config";
import {counter} from "Boundsoff_PageBuilderLivePreview/js/model/stores";

export default class {
    readonly counter = counter;
    protected readonly peer: Peer;
    protected readonly clients: Map<DataConnection, SocketClient> = new Map();
    protected masterContentRendered: string;

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
        });
        connection.on('close', this.onClose.bind(this, connection));

        this.clients.set(connection, { storeViewCode: '-' });
    }

    public data(connection: DataConnection, data: SocketMessage): void {
        switch (data.topic) {
            case 'REGISTER':
                this.onRegister(connection, <RegisterSocketData>data.data);
                break;
            case 'CLOSE':
                this.onClose(connection);
                break;
            default:
                console.warn(`Undefined socket message type.`);
                break;
        }
    }

    protected fetchContent(storeCode: string, content: string): JQueryPromise<string> {
        const url = Config.getConfig('directive_filter_url')
        const request = {
            method: 'POST',
            data: { storeCode, content },
        }

        return $.ajax(url, request);
    }

    protected afterMasterFormatRender({ value }: { value: string }): void {
        this.masterContentRendered = value;

        if (!this.clients.size || !this.peer.open) {
            return;
        }

        for (let [connection, client] of this.clients.entries()) {
            this.fetchContent(client.storeViewCode, this.masterContentRendered)
                .then(content => {
                    const messageData: RenderSocketData = { content };
                    const message: SocketMessage = { topic: 'RENDER', data: messageData };

                    connection.send(message)
                });
        }
    }

    protected onRegister(connection: DataConnection, data: RegisterSocketData): void {
        const client = this.clients.get(connection);
        client.storeViewCode = data.storeViewCode;

        const counter = this.counter();
        counter[client.storeViewCode] = counter[client.storeViewCode] || 0;
        counter[client.storeViewCode] += 1;
        this.counter(counter);

        this.fetchContent(client.storeViewCode, this.masterContentRendered)
            .then(content => {
                const messageData: RenderSocketData = { content };
                const message: SocketMessage = { topic: 'RENDER', data: messageData };

                connection.send(message)
            });
    }

    protected onClose(connection: DataConnection): void {
        const client = this.clients.get(connection);

        const counter = this.counter();
        counter[client.storeViewCode] = counter[client.storeViewCode] || 0;
        counter[client.storeViewCode] = Math.max(counter[client.storeViewCode] - 1, 0);
        this.counter(counter);

        this.clients.delete(connection);
        connection.close();
    }
}
