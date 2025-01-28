<?php

namespace Boundsoff\PageBuilderLivePreview\ViewModel;

use Magento\Framework\App\RequestInterface;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Store\Api\StoreRepositoryInterface;
use Magento\Store\Model\StoreManager;
use Magento\Store\Model\StoreManagerInterface;

class LivePreviewDefault implements ArgumentInterface
{
    public const PARAM_PEER_ID = 'peer-id';

    /**
     * @param RequestInterface $request
     * @param SerializerInterface $serializer
     * @param StoreManagerInterface|StoreManager $storeManager
     */
    public function __construct(
        protected readonly RequestInterface $request,
        protected readonly SerializerInterface $serializer,
        protected readonly StoreManagerInterface $storeManager,
    ) {
    }

    /**
     * Get the peerId from the request
     *
     * @return string
     */
    public function getParamPeerId(): string
    {
        return (string)$this->request->getParam(static::PARAM_PEER_ID);
    }

    /**
     * Getting the serializer for json
     *
     * @return SerializerInterface
     */
    public function getSerializer(): SerializerInterface
    {
        return $this->serializer;
    }

    /**
     * Getting the storeCode for current storeView
     *
     * @return string
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function getStoreCode(): string
    {
        return $this->storeManager->getStore()->getCode();
    }
}
