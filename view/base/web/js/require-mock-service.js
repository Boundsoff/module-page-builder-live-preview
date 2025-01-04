class RequireMockService {
    serviceWorker;
    finishInstall;

    constructor(serviceWorker) {
        this.serviceWorker = serviceWorker;
        serviceWorker.addEventListener('install', this.onInstall);
        serviceWorker.addEventListener('message', this.onMessage);
        serviceWorker.addEventListener('fetch', this.onFetch);
    }

    onMessage(event) {
        const { action, payload } = event.data;

        switch (action) {
            case 'finish':
                this.finishInstall();
                break;
            default:
                break;
        }
    }

    onInstall(event) {
        event.waitUntil(new Promise(resolve => {
            this.finishInstall = resolve;
        }));
    }

    /**
     * @param { FetchEvent } event
     * @return void
     */
    onFetch(event) {
        if (!event.request.url.includes('requirejs-config.js')) {
            fetch(event.request)
                .then(event.respondWith);
            return;
        }

        const formData = new FormData();
        formData.set('requireJsConfigPath', event.request.url);

        fetch('/live_preview/service-worker/require-js-config', {
            method: 'POST',
            data: formData,
        })
            .then(event.respondWith);
    }
}

(new RequireMockService(self));
