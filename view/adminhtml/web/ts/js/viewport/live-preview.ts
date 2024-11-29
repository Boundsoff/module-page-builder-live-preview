import Config from "Magento_PageBuilder/js/config";
import {Dictionary} from "underscore";

export default class LivePreview {
    public readonly template = 'Boundsoff_PageBuilderLivePreview/viewport/live-preview';
    protected readonly icomoonFeed = 'Boundsoff_PageBuilderLivePreview/icomoon/feed.svg';
    protected dialogElement: HTMLDialogElement;

    public get srcIcomoonFeed(): string {
        const themeUrl = Config.getConfig('theme_url');

        return `${themeUrl}/${this.icomoonFeed}`;
    }

    public get stores(): Dictionary<{ code: string, name: string }> {
        return Config.getConfig('stores');
    }

    constructor() {
        document.addEventListener('click', this.onDocClick.bind(this));
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
