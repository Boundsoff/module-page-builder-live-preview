<?php

namespace Boundsoff\PageBuilderLivePreview\Plugin;

use Magento\Framework\View\Asset\Repository;
use Magento\PageBuilder\Model\Stage\Config;
use Magento\Store\Api\Data\StoreInterface;
use Magento\Store\Api\StoreManagementInterface;
use Magento\Store\Api\StoreRepositoryInterface;
use Magento\Store\Model\Store;

class StageConfig
{
    public function __construct(
        protected readonly Repository $assetRepo,
        protected readonly StoreRepositoryInterface $storeRepository,
    )
    {

    }

    /**
     * @param Config $subject
     * @param array $result
     * @return array
     */
    public function afterGetConfig(Config $subject, array $result): array
    {
        $staticUrl = $this->assetRepo->getUrl('');
        $staticUrl = trim($staticUrl, '/');
        $staticUrl = str_replace(['https:', 'http:'], '', $staticUrl);

        $stores = $this->storeRepository->getList();
        $stores = array_filter($stores, fn (StoreInterface $store) => $store->getCode() !== 'admin');
        $stores = array_map(fn (StoreInterface $store) => [$store->getCode(), $this->getStoreInformation($store)], $stores);
        $stores = array_column($stores, 1, 0);

        $result['theme_url'] = $staticUrl;
        $result['stores'] = $stores;
        return $result;
    }

    /**
     * @param StoreInterface|Store $store
     * @return array
     */
    public function getStoreInformation(StoreInterface $store): array
    {
        $baseUrl = $store->getBaseUrl();
        $baseUrl = trim($baseUrl, '/');
        $baseUrl .= "/live-preview/index/index/peer-id/:peer-id:";

        return [
            'baseUrl' => $baseUrl,
            'code' => $store->getCode(),
            'name' => $store->getName(),
        ];
    }
}
