<?php

namespace Boundsoff\PageBuilderLivePreview\Test\Mftf\Helper;

use Magento\FunctionalTestingFramework\Helper\Helper;
use Magento\FunctionalTestingFramework\Module\MagentoWebDriver;

class ResponseOverrideHelper extends Helper
{
    public function staticFile(string $requestPath, string $responsePath): void
    {
        $serviceWorker = ''; // @todo need service worker path register
        $scope = ''; // @todo need to translate requested path
        $override = ''; // @todo need to translate response path

        // @todo need to be sure that is not already registered
        // @todo need to some kind uninstall afterwards, maybe session close event?
        // @todo need to figure out the way for some kind of override
        $installServiceWorker = <<<JS
if (("serviceWorker") in navigator) {
        navigator.serviceWorker.register("{$serviceWorker}", {
            scope: "{$scope}",
        })
            .then(registration => {
                switch(true) {
                    case !!registration.installing:
                    case !!registration.waiting:
                        break; // @todo should log this somehow
                    case !!registration.active:
                        registration.active.postMessage("{$override}");
                        break;
                    default:
                        break; // @todo should throw some kind of error
                }
            })
            .catch(error => {
               // @todo should also log this
            });
}
JS;

        /** @var MagentoWebDriver $magentoWebDriver */
        $magentoWebDriver = $this->getModule(MagentoWebDriver::class);
        $magentoWebDriver->executeJS($installServiceWorker);
        $magentoWebDriver->webDriver->close();
    }
}
