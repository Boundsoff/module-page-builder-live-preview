<?php

namespace Boundsoff\PageBuilderLivePreview\Controller\ServiceWorker;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\Result\Raw as ResultRaw;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Filesystem;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Framework\Session\Storage;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Psr\Log\LoggerInterface;

class RequireJsConfig implements HttpPostActionInterface
{
    public const REQUIRE_JS_CONFIG_PATH = 'requireJsConfigPath';

    public function __construct(
        protected readonly RequestInterface $request,
        protected readonly AssetRepository $assetRepository,
        protected readonly Filesystem $filesystem,
        protected readonly ResultFactory $resultFactory,
        protected readonly LoggerInterface $logger,
        protected readonly Storage       $sessionStorage,
        protected readonly SerializerInterface $serializer,
    ) {
    }

    public function execute()
    {
        $directoryStatic = $this->filesystem->getDirectoryRead(DirectoryList::STATIC_VIEW);
        $requireJsConfigPath = $this->request->getParam(static::REQUIRE_JS_CONFIG_PATH);
        $requireJsConfigPath = ltrim('/', $requireJsConfigPath);
        $requireJsConfigPath = ltrim('static', $requireJsConfigPath);
        $requireJsConfig = $directoryStatic->readFile($requireJsConfigPath);

        $requireMixins = [];
        foreach (($this->sessionStorage->getData('requireMixins') ?? []) as $component => $mixin) {
            $url = $this->assetRepository->createAsset($component)
                ->getUrl();

            if (empty($url)) {
                continue;
            }
            $requireMixins[$component][$mixin] = true;
        }

        if (!empty($requireMixins)) {
            $requireMixins = $this->serializer->serialize($requireMixins);

            $requireJsConfig .= "\n";
            $requireJsConfig .= <<<JS
(function() {
/**
 * mock service inject
 */

var config = {
    config: {
        mixins: {$requireMixins},
    }
};

require.config(config);
})();
JS;
        }

        /** @var ResultRaw $resultRaw */
        $resultRaw = $this->resultFactory->create(ResultFactory::TYPE_RAW);
        $resultRaw->setHttpResponseCode(200);
        $resultRaw->setHeader('Content-Type', 'application/javascript');
        $resultRaw->setContents($requireJsConfig);

        return $resultRaw;
    }
}
