import PageBuilder from "Magento_PageBuilder/js/page-builder";
import LivePreview from "Boundsoff_PageBuilderLivePreview/js/viewport/live-preview";
import LivePreviewService from "Boundsoff_PageBuilderLivePreview/js/live-preview-service";

export default function (base: typeof PageBuilder) {
    return class PageBuilderMixin extends base {
        readonly livePreview = new LivePreview();
        protected livePreviewService: LivePreviewService;

        get viewportTemplate(): string {
            return "Boundsoff_PageBuilderLivePreview/viewport/switcher"
        }

        constructor(config: any, initialValue: string) {
            super(config, initialValue);

            if (this.isStageReady()) {
                this.startLivePreviewService();
            } else {
                this.isStageReady.subscribe(() => {
                    this.startLivePreviewService();
                });
            }
        }

        protected startLivePreviewService(): void
        {
            this.livePreviewService = new LivePreviewService(this);
        }
    }
}
