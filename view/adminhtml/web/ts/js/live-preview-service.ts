import PageBuilderInterface from "Magento_PageBuilder/js/page-builder.types";
import {
    CloseSocketData,
    ConnectSocketData,
    SocketClient,
    SocketMessage
} from "./live-preview-service.types";
import events from "Magento_PageBuilder/js/events";
import LivePreviewEncoder from "Boundsoff_PageBuilderLivePreview/js/live-preview-encoder";

export default class {
    protected readonly socket: WebSocket;
    protected readonly clients: Map<string, SocketClient> = new Map();

    constructor(
        protected readonly pageBuilder: PageBuilderInterface,
    ) {
        window.addEventListener('beforeunload', () => {
            this.socket.close();
        }, { passive: true });

        const url = new URL(location.origin);
        url.pathname = `/page-builder/preview/${this.pageBuilder.id}/`;
        url.protocol = 'wss';

        this.socket = new WebSocket(url.toString());
        this.socket.addEventListener('message', this.onSocketMessage.bind(this));

        events.on(
            `stage:${ this.pageBuilder.stage.id }:masterFormatRenderAfter`,
            this.afterMasterFormatRender.bind(this),
        );
    }

    protected afterMasterFormatRender({ value }: { value: string}): void {
        if (!this.clients.size) {
            return;
        }

        const socketMessage: SocketMessage = { type: LivePreviewTopic.render, data: { value } }
        const data = LivePreviewEncoder.encode(socketMessage);
        this.socket.send(data);
    }

    protected onSocketMessage(event: MessageEvent): void {
        LivePreviewEncoder.decode(event.data)
            .then((data: SocketMessage) => {
                switch (data.topic) {
                    case LivePreviewTopic.connect:
                        this.onConnect(<ConnectSocketData>data.data);
                        break;
                    case LivePreviewTopic.close:
                        this.onClose(<CloseSocketData>data.data);
                        break;
                    default:
                        console.warn(`Undefined socket message type.`);
                        break;
                }
            })
    }

    protected onConnect(data: ConnectSocketData): void {
        if (this.clients.has(data.id)) {
            console.warn('already got this socket client');
        }

        this.clients.set(data.id, new SocketClient(data.id, data.storeViewCode));
    }

    protected onClose(data: CloseSocketData): void {
        if (!this.clients.has(data.id)) {
            console.warn(`client wasn't even register`);
        }

        this.clients.delete(data.id);
    }
}
