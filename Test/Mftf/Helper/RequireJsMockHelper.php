<?php

namespace Boundsoff\PageBuilderLivePreview\Test\Mftf\Helper;

use Codeception\TestInterface;
use Facebook\WebDriver\Remote\RemoteWebDriver as FacebookWebDriver;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\FunctionalTestingFramework\Helper\Helper;
use Magento\FunctionalTestingFramework\Module\MagentoWebDriver;
use Magento\Persistent\Helper\Session;

class RequireJsMockHelper extends Helper
{
    protected static $configMixin = [];

    public function installServiceWorker(): void
    {
        $scriptInstall = <<<JS
if (navigator?.serviceWorker) {
        navigator.serviceWorker.register('/sw-mock-service.js', {
            scope: '/',
        })
            .then(registration => {
                switch(true) {
                    case !!registration.installing:
                    case !!registration.waiting:
                    case !!registration.active:
                        break; // @todo should log this somehow
                    default:
                        break; // @todo should throw some kind of error
                }
            })
            .catch(error => {
                console.error('error while, register mock service worker');
                console.error(error);
            });
}
JS;
        /** @var MagentoWebDriver $magentoWebDriver */
        /** @var FacebookWebDriver $webDriver */
        $magentoWebDriver = $this->getModule('\Magento\FunctionalTestingFramework\Module\MagentoWebDriver');
        $webDriver = $magentoWebDriver->webDriver;
        $webDriver->executeScript($scriptInstall);
    }

    public function uninstallServiceWorker(): void
    {
        $scriptUninstall = <<<JS
if (navigator?.serviceWorker) {
    navigator.serviceWorker.getRegistration('/sw-mock-service.js')
        .then(registration => registration.unregister())
        .then(() => console.log('unregister mock service worker'))
        .catch(error => {
            console.error('error while, unregister mock service worker');
            console.error(error);
        })
}
JS;

        /** @var MagentoWebDriver $magentoWebDriver */
        /** @var FacebookWebDriver $webDriver */
        $magentoWebDriver = $this->getModule('\Magento\FunctionalTestingFramework\Module\MagentoWebDriver');
        $webDriver = $magentoWebDriver->webDriver;
        $webDriver->executeScript($scriptUninstall);
    }

    public function appendMixin(string $component, string $mixin): void
    {
        $objectManager = ObjectManager::getInstance();
        /** @var \Magento\Framework\Session\Storage $storageSession */
        $storageSession = $objectManager->get('Boundsoff\PageBuilderLivePreview\Model\Session\Storage');
        $requireMixins = $storageSession->getData('requireMixins') ?? [];
        $requireMixins[$component][] = $mixin;
        $storageSession->setData('requireMixins', $requireMixins);
    }

    public function finishServiceWorker()
    {
        $scriptUninstall = <<<JS
if (navigator?.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'finish', payload: null });
}
JS;

        /** @var MagentoWebDriver $magentoWebDriver */
        /** @var FacebookWebDriver $webDriver */
        $magentoWebDriver = $this->getModule('\Magento\FunctionalTestingFramework\Module\MagentoWebDriver');
        $webDriver = $magentoWebDriver->webDriver;
        $webDriver->executeScript($scriptUninstall);
    }
}
