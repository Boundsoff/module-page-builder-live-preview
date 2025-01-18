<?php

namespace Boundsoff\PageBuilderLivePreview\Controller\Adminhtml\Directive;

use Magento\Cms\Model\Template\FilterProvider;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Filter\Template;
use Magento\Store\Model\App\Emulation;
use Magento\Store\Model\StoreRepository;

class Filter implements HttpPostActionInterface
{
    public function __construct(
        protected readonly FilterProvider   $filterProvider,
        protected readonly ResultFactory    $resultFactory,
        protected readonly RequestInterface $request,
        protected readonly Emulation        $emulation,
        protected readonly StoreRepository  $storeRepository,
    )
    {
    }

    public function execute()
    {
        $content = $this->request->getParam('content') ?? '';
        $storeCode = $this->request->getParam('storeCode');
        $store = $this->storeRepository->get($storeCode);

        $this->emulation->startEnvironmentEmulation($store->getId(), 'frontend');
        $this->resultFactory->create(ResultFactory::TYPE_PAGE)
            ->initLayout();

        $content = $this->filterProvider->getPageFilter()
            ->filter($content);

        return $this->resultFactory->create(ResultFactory::TYPE_RAW)
            ->setContents($content);
    }
}
