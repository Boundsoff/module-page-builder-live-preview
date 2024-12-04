import PageBuilder from "Magento_PageBuilder/js/page-builder";
import LivePreview from "Boundsoff_PageBuilderLivePreview/js/viewport/live-preview";

export default function (base: typeof PageBuilder) {
    return class PageBuilderMixin extends base {
        readonly livePreview = new LivePreview();

        get viewportTemplate(): string {
            return "Boundsoff_PageBuilderLivePreview/viewport/switcher"
        }
    }
}
