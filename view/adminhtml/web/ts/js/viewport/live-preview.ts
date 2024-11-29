import Config from "Magento_PageBuilder/js/config";

export default class LivePreview {
    public readonly template = 'Boundsoff_PageBuilderLivePreview/viewport/live-preview';
    protected readonly icomoonFeed = 'Boundsoff_PageBuilderLivePreview/icomoon/feed.svg';
    protected dialogElement: HTMLDialogElement;

    public get srcIcomoonFeed() {
        const themeUrl = Config.getConfig('theme_url');

        return `${themeUrl}/${this.icomoonFeed}`;
    }

    public get stores() {
        return Config.getConfig('stores');
    }

    constructor() {
        document.addEventListener('click', this.onDocClick.bind(this));
    }
    public getTemplate() {
        return this.template;
    }

    public bindDialog(modelElement: HTMLDialogElement) {
        this.dialogElement = modelElement;
    }

    public onPreviewClick(_: any, event: MouseEvent) {
        if (!this.dialogElement.open) {
            event.stopPropagation();

            this.dialogElement.show();
        }
    }

    protected onDocClick(event: MouseEvent) {
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
