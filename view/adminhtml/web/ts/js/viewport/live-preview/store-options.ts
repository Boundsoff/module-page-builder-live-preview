import {StoreInformation, active, counter} from "Boundsoff_PageBuilderLivePreview/js/model/stores";
import Config from "Magento_PageBuilder/js/config";

export type StoreOption = { label: string, value: StoreOption[] | string };

export default class StoreOptions {
    public readonly storeViewCounter = counter;
    public readonly options: { isStore: boolean, label: string; value: StoreOptions | StoreInformation, depth: number }[];
    protected readonly template: string = 'Boundsoff_PageBuilderLivePreview/viewport/live-preview/store-options';

    public get stores() {
        const stores: Map<string, StoreInformation> = new Map();

        for (let store of Object.values<StoreInformation>(Config.getConfig('stores'))) {
            stores.set(store.id.toString(), store);
        }

        return stores;
    }

    constructor(options: StoreOption[], depth: number = 1) {
        this.options = options.map(it => {
            if (Array.isArray(it.value)) {
                return {
                    isStore: false,
                    label: it.label,
                    value: new StoreOptions(it.value, depth + 1),
                    depth,
                }
            }

            return {
                isStore: true,
                label: it.label,
                value: this.stores.get(it.value),
                depth,
            };
        })
    }

    public getTemplate(): string {
        return this.template;
    }

    public setStoreActive(store: StoreInformation): void {
        active(store);
    }
}
