import Config from "Magento_PageBuilder/js/config";
import {Dictionary} from "underscore";
import ko from 'knockout';

type StoreInformation = { code: string, name: string };

export default class LivePreview {
    public readonly template = 'Boundsoff_PageBuilderLivePreview/viewport/live-preview';
    public readonly storeActive?: KnockoutObservable<StoreInformation | null> = ko.observable(null);
    public readonly copyStatus: KnockoutObservable<string> = ko.observable('Copy ©');
    public readonly storeShown: KnockoutObservable<boolean>;
    protected readonly icomoonFeed = 'Boundsoff_PageBuilderLivePreview/icomoon/feed.svg';
    protected dialogElement: HTMLDialogElement;

    public get srcIcomoonFeed(): string {
        const themeUrl = Config.getConfig('theme_url');

        return `${themeUrl}/${this.icomoonFeed}`;
    }

    public get stores(): Dictionary<StoreInformation> {
        return Config.getConfig('stores');
    }

    public get previewLink(): string {
        // this.storeActive()
        return 'https://google.com/';
    }

    constructor() {
        document.addEventListener('click', this.onDocClick.bind(this));
        this.storeShown = ko.computed(() => !!this.storeActive());
    }
    public getTemplate(): string {
        return this.template;
    }

    public bindDialog(modelElement: HTMLDialogElement): void {
        this.dialogElement = modelElement;
    }

    public onPreviewClick(_: any, event: MouseEvent): void {
        if (!this.dialogElement.open) {
            event.stopPropagation();

            this.dialogElement.show();
        }
    }

    public getConnectionCount(code: string): string {
        return Number(0).toString(); // @todo
    }

    public setStoreActive(store?: StoreInformation): void {
        this.storeActive(store);
    }

    public copyLink(): void {
        // noinspection JSIgnoredPromiseFromCall
        this.copyStatus('Copied ✔');
        navigator.clipboard.writeText(this.previewLink)
            .then(() => {
                setTimeout(() => {
                    this.copyStatus('Copy ©');
                }, 5000);
            })
    }

    protected onDocClick(event: MouseEvent): void {
        if (!this.dialogElement?.open) {
            return;
        }

        let element = <HTMLElement>event.target;
        do {
            if (element.isEqualNode(this.dialogElement)) {
                return;
            }
            element = element.parentElement;
        } while (element);

        this.dialogElement.close();
    }
}
