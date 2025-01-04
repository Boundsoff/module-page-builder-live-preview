<?php

namespace Boundsoff\PageBuilderLivePreview\Router;

use Boundsoff\PageBuilderLivePreview\Controller\ServiceWorker\Index;
use Magento\Framework\App\ActionFactory;
use Magento\Framework\App\ActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\RouterInterface;

class ServiceWorkerMockRouter implements RouterInterface
{
    public function __construct(
        protected readonly ActionFactory $actionFactory,
    )
    {
    }

    /**
     * Redirect for intended mock service worker to the controller
     *
     * @param RequestInterface $request
     * @return ActionInterface|null
     */
    public function match(RequestInterface $request)
    {
        if (!($request instanceof \Magento\Framework\App\Request\Http)) {
            return null;
        }

        /** @var \Magento\Framework\App\Request\Http $request */
        $requestUri = $request->getRequestUri();
        if (str_contains($requestUri, '/sw-mock-service.js')) {
            return $this->actionFactory->create(Index::class);
        }

        return null;
    }
}
