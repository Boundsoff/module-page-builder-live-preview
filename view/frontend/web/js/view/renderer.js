define([
    'uiComponent',
    'Boundsoff_PageBuilderLivePreview/js/live-preview-service',
], function (Component, LivePreviewService) {
    return Component.extend({
        defaults: {
            peerId: '-',
            storeCode: '-',
        },
        initialize() {
            this._super();

            this.initService();
        },
        initService() {
            this.service = new LivePreviewService(this.peerId, this.storeCode);
            this.previewContent = this.service.content;
        },
    });
})
