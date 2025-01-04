class RequireMockService {
    serviceWorker;
    finishInstall;

    constructor(serviceWorker, url) {
        this.serviceWorker = serviceWorker;
        this.url = url;

        serviceWorker.addEventListener('install', this.onInstall.bind(this));
        serviceWorker.addEventListener('activate', this.onActive.bind(this));
        serviceWorker.addEventListener('message', this.onMessage.bind(this));
        serviceWorker.addEventListener('fetch', this.onFetch.bind(this));
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
        /** @check for it */
        console.log('install');
    }

    onActive(event) {
        console.log('activated');
    }

    /**
     * @param { FetchEvent } event
     * @return void
     */
    onFetch(event) {
        if (!event.request.url.includes('requirejs-config.js')) {
            event.respondWith(fetch(event.request));
            return;
        }

        const url = new URL(event.request.url);

        const requestUrl = new URL(this.url);
        requestUrl.searchParams.set('file', url.pathname);
        requestUrl.searchParams.set('isAjax', true);

        event.respondWith(
            fetch(requestUrl.toString())
        );
    }
}
