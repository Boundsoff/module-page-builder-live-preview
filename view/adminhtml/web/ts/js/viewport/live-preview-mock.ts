import LivePreview from "Boundsoff_PageBuilderLivePreview/js/viewport/live-preview";

export default function (base: typeof LivePreview) {
    return class PageBuilderMixin extends base {
        public get previewLink(): string {
            return `https://google.com/`; // @todo replace to website
        }
    }
}
