<?php

namespace Boundsoff\PageBuilderLivePreview\Plugin;

use Magento\Framework\View\Asset\Repository;
use Magento\PageBuilder\Model\Stage\Config;
use Magento\Store\Api\Data\StoreInterface;
use Magento\Store\Api\StoreManagementInterface;
use Magento\Store\Api\StoreRepositoryInterface;

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
        $stores = array_map(fn (StoreInterface $store) => [$store->getCode(), ["name" => $store->getName()]], $stores);
        $stores = array_column($stores, 1, 0);

        $result['theme_url'] = $staticUrl;
        $result['stores'] = $stores;
        return $result;
    }
}
