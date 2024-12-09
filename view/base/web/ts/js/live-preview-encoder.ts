import {SocketMessage} from "Boundsoff_PageBuilderLivePreview/js/live-preview-service.types";
import pako from "pako";

export default class {

    static encode(data: SocketMessage): Blob {
        const encoded = JSON.stringify(data);
        const compressed = pako.gzip(encoded);
        return new Blob([compressed], {type: 'application/json'});
    }

    static decode(data: Blob): Promise<SocketMessage> {
        return data.arrayBuffer()
            .then(buffer => (new Uint8Array(buffer)))
            .then(bufferArray => pako.ungzip(bufferArray, {to: 'string'}))
            .then((encoded: string) => JSON.parse(encoded));
    }
}
