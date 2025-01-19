<?php

namespace Boundsoff\PageBuilderLivePreview\Controller\Worker;

use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\CacheInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\Result\Raw as ResultRaw;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Framework\Session\SessionManagerInterface;
use Magento\Framework\Session\Storage;

class Mixins implements HttpPostActionInterface
{
    public function __construct(
        protected readonly RequestInterface $request,
        protected readonly ResultFactory    $resultFactory,
        protected readonly CacheInterface $cache,
        protected readonly SerializerInterface $serializer,
    )
    {
    }


    public function execute()
    {
        $mixins = $this->request->getParam('mixins');
        $mixins = $this->serializer->serialize($mixins);
        /** @noinspection PhpUndefinedMethodInspection */
        $this->cache->save($mixins, 'requireMockMixins');

        /** @var ResultRaw $resultRaw */
        $resultRaw = $this->resultFactory->create(ResultFactory::TYPE_RAW);
        $resultRaw->setHttpResponseCode(201);
        return $resultRaw;
    }
}
