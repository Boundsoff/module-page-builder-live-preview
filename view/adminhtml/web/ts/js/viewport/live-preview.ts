import Config from "Magento_PageBuilder/js/config";
import {Dictionary} from "underscore";
import ko from 'knockout';
import PageBuilderInterface from "Magento_PageBuilder/js/page-builder.types";
import {PageBuilderMixin} from "Boundsoff_PageBuilderLivePreview/js/page-builder-mixin";
import StoreOptions, {StoreOption} from "Boundsoff_PageBuilderLivePreview/js/viewport/live-preview/store-options";
import {active, counter, StoreInformation} from "Boundsoff_PageBuilderLivePreview/js/model/stores";

declare class QrcodeMin {
    constructor(element: string | HTMLElement, config: object);

    clear(): void;

    makeCode(text: string): void;
}

export default class LivePreview {
    public readonly template = 'Boundsoff_PageBuilderLivePreview/viewport/live-preview';
    public readonly storeActive = active;
    public readonly copyStatus: KnockoutObservable<string> = ko.observable('Copy ©');
    public readonly storeShown: KnockoutObservable<boolean>;
    public readonly storeOptionsComponent: StoreOptions;
    protected readonly icomoonFeed = 'Boundsoff_PageBuilderLivePreview/icomoon/feed.svg';
    protected dialogElement: HTMLDialogElement;
    protected qrElement: HTMLDivElement;
    private qrcode: QrcodeMin;

    public get srcIcomoonFeed(): string {
        const themeUrl = Config.getConfig('theme_url');

        return `${themeUrl}/${this.icomoonFeed}`;
    }

    public get stores(): Dictionary<StoreInformation> {
        return Config.getConfig('stores');
    }

    public get storeOptions(): StoreOption[] {
        return Config.getConfig('store_options')
    }

    public get previewLink(): string {
        return (this.storeActive()?.baseUrl || '')
            .replace(':peer-id:', this.pageBuilder.livePreviewPeerId);
    }

    public get storeViewCounter(): KnockoutObservable<object> {
        return counter;
    }

    constructor(
        protected readonly pageBuilder: PageBuilderInterface & PageBuilderMixin,
    ) {
        this.storeOptionsComponent = new StoreOptions(this.storeOptions);

        document.addEventListener('click', this.onDocClick.bind(this));
        this.storeShown = ko.computed(() => !!this.storeActive());
        this.storeActive.subscribe(() => {
            if (this.qrcode) {
                this.qrcode.clear();
                this.qrcode.makeCode(this.previewLink);
            }
        })
    }

    public getTemplate(): string {
        return this.template;
    }

    public bindDialog(modelElement: HTMLDialogElement): void {
        this.dialogElement = modelElement;
    }

    public bindQrElement(qrElement: HTMLDivElement): void {
        this.qrElement = qrElement;
        this.qrcode = new QrcodeMin(this.qrElement, {
            text: this.previewLink,
        })
    }

    public onPreviewClick(_: any, event: MouseEvent): void {
        if (!this.dialogElement.open) {
            event.stopPropagation();

            this.dialogElement.show();
        }
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
