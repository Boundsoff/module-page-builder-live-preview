<?php

namespace Boundsoff\PageBuilderLivePreview\ViewModel;

use Magento\Framework\App\RequestInterface;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;

class LivePreviewDefault implements ArgumentInterface
{
    const PARAM_PEER_ID = 'peer-id';

    public function __construct(
        protected readonly RequestInterface $request,
        protected readonly SerializerInterface $serializer,
    ) { }

    public function getParamPeerId(): string
    {
        return (string)$this->request->getParam(static::PARAM_PEER_ID);
    }

    public function getSerializer(): SerializerInterface
    {
        return $this->serializer;
    }
}
