<?php

namespace Boundsoff\PageBuilderLivePreview\Plugin;

use Magento\Framework\UrlInterface;
use Magento\Framework\View\Asset\Repository;
use Magento\PageBuilder\Model\Stage\Config;
use Magento\Store\Api\Data\StoreInterface;
use Magento\Store\Api\StoreRepositoryInterface;
use Magento\Store\Model\Store;
use Magento\Store\Ui\Component\Listing\Column\Store\Options;

class StageConfig
{
    public function __construct(
        protected readonly Repository               $assetRepo,
        protected readonly StoreRepositoryInterface $storeRepository,
        protected readonly UrlInterface             $urlBuilder,
        protected readonly Options $storeOptions,
    ) {

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

        $storeOptions = $this->storeOptions->toOptionArray();
        array_walk_recursive($storeOptions, function (&$option, $key) {
            if ($key === 'label') {
                $option = trim($option);
            }
        });

        $result['directive_filter_url'] = $this->urlBuilder->getUrl('live-preview/directive/filter');
        $result['theme_url'] = $staticUrl;
        $result['stores'] = $stores;
        $result['store_options'] = $storeOptions;
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
            'id' => $store->getId(),
            'code' => $store->getCode(),
            'name' => $store->getName(),
            'groupCode' => $store->getGroup()->getCode(),
        ];
    }
}
