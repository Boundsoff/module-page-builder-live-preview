<?php

namespace Boundsoff\PageBuilderLivePreview\Plugin;

use Magento\Framework\UrlInterface;
use Magento\Framework\View\Asset\Repository;
use Magento\PageBuilder\Model\Stage\Config;

class StageConfig
{
    public function __construct(
        protected readonly Repository $assetRepo,
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

        $result['theme_url'] = $staticUrl;
        return $result;
    }
}
