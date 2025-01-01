<?php

namespace Boundsoff\PageBuilderLivePreview\Plugin;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Asset\Repository;
use Magento\PageBuilder\Model\Stage\Config;
use Magento\Store\Api\Data\StoreInterface;
use Magento\Store\Model\StoreManagerInterface;

class StageConfig
{
    /**
     * @param Repository $assetRepo
     * @param UrlInterface $urlBuilder
     * @param StoreManagerInterface $storeManager
     */
    public function __construct(
        protected readonly Repository               $assetRepo,
        protected readonly UrlInterface             $urlBuilder,
        protected readonly StoreManagerInterface    $storeManager,
    ) {
    }

    /**
     * Append additional information for pagebuilder config
     *
     * @param Config $subject
     * @param array $result
     * @return array
     * @throws NoSuchEntityException
     * @noinspection PhpUnusedParameterInspection
     */
    public function afterGetConfig(Config $subject, array $result): array
    {
        $staticUrl = $this->assetRepo->getUrl('');
        $staticUrl = trim($staticUrl, '/');
        $staticUrl = str_replace(['https:', 'http:'], '', $staticUrl);

        $stores = $this->storeManager->getStores();
        $stores = array_filter($stores, fn (StoreInterface $store) => $store->getCode() !== 'admin');
        $stores = array_map(fn (StoreInterface $store) => [$store->getCode(), $this->getInfo($store)], $stores);
        $stores = array_column($stores, 1, 0);

        $result['directive_filter_url'] = $this->urlBuilder->getUrl('live-preview/directive/filter');
        $result['theme_url'] = $staticUrl;
        $result['stores'] = $stores;
        $result['store_options'] = $this->getStoreOptions();
        return $result;
    }

    /**
     * Getting store information for adminhtml
     *
     * @param StoreInterface $store
     * @return array
     * @throws NoSuchEntityException
     */
    public function getInfo(StoreInterface $store): array
    {
        $baseUrl = $store->getBaseUrl();
        $baseUrl = trim($baseUrl, '/');
        $baseUrl .= "/live-preview/index/index/peer-id/:peer-id:";

        return [
            'baseUrl' => $baseUrl,
            'id' => $store->getId(),
            'code' => $store->getCode(),
            'name' => $store->getName(),
            'groupCode' => $store->getGroup()->getCode(),
        ];
    }

    /**
     * Get simple structure in nested array
     */
    protected function getStoreOptions(): array
    {
        $websites = $this->storeManager->getWebsites();

        $options = [];
        foreach ($websites as $website) {
            $groups = $this->storeManager->getGroups();
            $optionGroup = [];

            foreach ($groups as $group) {
                if ($group->getWebsiteId() !== $website->getId()) {
                    continue;
                }

                $optionStores = [];
                $stores = $this->storeManager->getStores();
                foreach ($stores as $store) {
                    if (!$store->getIsActive()) {
                        continue;
                    }

                    if ($store->getStoreGroupId() !== $group->getId()) {
                        continue;
                    }

                    $optionStores[] = ['value' => $store->getId(), 'label' => $store->getName()];
                }

                if (!empty($optionStores)) {
                    $optionGroup[] = ['value' => $optionStores, 'label' => $group->getName()];
                }
            }

            if (!empty($optionStores)) {
                $options[] = ['value' => $optionGroup, 'label' => $website->getName()];
            }
        }

        return $options;
    }
}
