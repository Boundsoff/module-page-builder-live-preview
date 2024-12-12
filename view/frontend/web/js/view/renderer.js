define([
    'uiComponent',
    'Boundsoff_PageBuilderLivePreview/js/live-preview-service',
    'mage/apply/main',
], function (Component, LivePreviewService, main) {
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
            this.previewContent.subscribe(() => {
                const element = document.createElement('div');
                element.innerHTML = this.previewContent();

                for (let child of this.container.children) {
                    child.remove();
                }
                this.container.append(element);
                main.apply(element);
            });
        },
        bindContainer(containerElement) {
            this.container = containerElement;
        },
    });
})
