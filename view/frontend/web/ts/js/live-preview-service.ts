import ko from 'knockout';
import {
    RegisterSocketData,
    RenderSocketData,
    SocketMessage
} from "Boundsoff_PageBuilderLivePreview/js/live-preview-service.types";

export default class LivePreviewService {
    readonly content: KnockoutObservable<string> = ko.observable('<code>Loading...</code>');
    protected readonly peer: Peer;
    protected connection: DataConnection;

    constructor(peerId: string, protected readonly storeCode: string) {
        this.peer = new Peer();
        this.peer.on('open', () => {
            this.connection = this.peer.connect(peerId);
            this.connection.on('data', this.connectionData.bind(this));
            this.connection.on('open', this.connectionOpen.bind(this));

            window.addEventListener('beforeunload', () => {
                this.connection.close();
                this.peer.disconnect();
            }, { passive: true });
        })
    }

    connectionOpen() {
        const data: RegisterSocketData = { storeViewCode: this.storeCode };
        const message: SocketMessage = { topic: 'REGISTER', data };

        this.connection.send(message);
    }

    connectionData(data: SocketMessage) {
        switch (data.topic) {
            case 'CLOSE':
                this.peer.disconnect();
                break;
            case 'RENDER':
                const { content } = <RenderSocketData>data.data;
                this.content(content);
                break;
            default:
                console.warn('unhandled peer connection data message');
                break;
        }
    }
}
