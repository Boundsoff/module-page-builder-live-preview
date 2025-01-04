<?php

namespace Boundsoff\PageBuilderLivePreview\Controller\ServiceWorker;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Controller\Result\Raw as ResultRaw;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Exception\NotFoundException;
use Magento\Framework\Filesystem;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Psr\Log\LoggerInterface;
use Throwable;

class Index implements HttpGetActionInterface
{
    /**
     * @param AssetRepository $assetRepository
     * @param Filesystem $filesystem
     * @param ResultFactory $resultFactory
     * @param LoggerInterface $logger
     */
    public function __construct(
        protected readonly AssetRepository $assetRepository,
        protected readonly Filesystem $filesystem,
        protected readonly ResultFactory $resultFactory,
        protected readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Getting the static file content
     *
     * @return ResultRaw
     */
    public function execute()
    {
        /** @var ResultRaw $resultRaw */
        $resultRaw = $this->resultFactory->create(ResultFactory::TYPE_RAW);
        $resultRaw->setHttpResponseCode(200);
        $resultRaw->setHeader('Content-Type', 'application/javascript');

        try {
            $url = $this->assetRepository->createAsset('Boundsoff_PageBuilderLivePreview/js/require-mock-service.js')
                ->getPath();

            $directoryStatic = $this->filesystem->getDirectoryRead(DirectoryList::STATIC_VIEW);
            if (!$directoryStatic->isExist($url)) {
                throw new NotFoundException(__("File not found at: %1", $url));
            }

            $resultRaw->setContents($directoryStatic->readFile($url));
        } catch (Throwable $exception) {
            $this->logger->error($exception->getMessage());
            $this->logger->debug($exception->getTraceAsString());

            $resultRaw->setHttpResponseCode(404);
            $resultRaw->setContents('');
        }

        return $resultRaw;
    }
}
