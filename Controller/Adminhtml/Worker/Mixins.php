<?php

namespace Boundsoff\PageBuilderLivePreview\Controller\Adminhtml\Worker;

use Boundsoff\PageBuilderLivePreview\Controller\Worker\Mixins as MixinsStoreFront;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\Action\HttpPostActionInterface;

class Mixins extends MixinsStoreFront implements HttpPostActionInterface, HttpGetActionInterface
{

}
