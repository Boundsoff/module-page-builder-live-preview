<?php

namespace Boundsoff\PageBuilderLivePreview\Test\Mftf\Helper;

use Codeception\TestInterface;
use Facebook\WebDriver\Remote\RemoteWebDriver as FacebookWebDriver;
use Facebook\WebDriver\WebDriverKeys;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\FunctionalTestingFramework\Helper\Helper;
use Magento\FunctionalTestingFramework\Module\MagentoWebDriver;
use Magento\Persistent\Helper\Session;

class RequireJsMockHelper extends Helper
{
    protected static array $configMixin = [];

    public function installServiceWorker(string $adminName = ''): void
    {
        if (!empty($adminName)) {
            $adminName = "/{$adminName}";
        }

        $scriptInstall = <<<JS
const [areaCode] = arguments;
if (navigator?.serviceWorker) {
        navigator.serviceWorker.register(`\${areaCode}/sw-mock-service.js`, {
            scope: `\${areaCode}/`,
        })
            .then(registration => {
                switch(true) {
                    case !!registration.installing:
                    case !!registration.waiting:
                    case !!registration.active:
                        console.log('registration.installing', !!registration.installing);
                        console.log('registration.waiting', !!registration.waiting);
                        console.log('registration.active', !!registration.active);
                        break;
                    default:
                        console.log('registration.unknown', registration);
                        break;
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
        $webDriver->executeScript($scriptInstall, [$adminName]);
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

    public function appendMixin(array $components): void
    {
        [$component, $mixin] = $components;
        static::$configMixin[$component][] = $mixin;
    }

    public function finishServiceWorker(string $baseUrl, ?string $adminName = null)
    {
        /** @var MagentoWebDriver $magentoWebDriver */
        /** @var FacebookWebDriver $webDriver */
        $magentoWebDriver = $this->getModule('\Magento\FunctionalTestingFramework\Module\MagentoWebDriver');
        $webDriver = $magentoWebDriver->webDriver;

        $requestUrl = $baseUrl;
        if ($adminName) {
            $requestUrl .= "{$adminName}/";
        }
        $requestUrl .= "live-preview/worker/mixins/";

        $scriptUninstall = <<<JS
const [requestUrl, mixins] = arguments;

require(['jquery'], function ($) {
    $.post(requestUrl, { mixins });
});
JS;
        $webDriver->executeScript($scriptUninstall, [$requestUrl, static::$configMixin]);
    }

}
