import Config from "Magento_PageBuilder/js/config";

export default class LivePreview {
    readonly template = 'Boundsoff_PageBuilderLivePreview/viewport/live-preview';
    protected readonly icomoonFeed = 'Boundsoff_PageBuilderLivePreview/icomoon/feed.svg';

    public getTemplate() {
        return this.template;
    }

    get srcIcomoonFeed() {
        const themeUrl = Config.getConfig('theme_url');

        return `${themeUrl}/${this.icomoonFeed}`;
    }
}
