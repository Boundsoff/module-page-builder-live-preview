<?php

namespace Boundsoff\PageBuilderLivePreview\Test\Mftf\Helper;

use chillerlan\QRCode\QRCode;
use Facebook\WebDriver\Remote\RemoteWebDriver as FacebookWebDriver;
use Facebook\WebDriver\WebDriverBy;
use Magento\FunctionalTestingFramework\Helper\Helper;
use Magento\FunctionalTestingFramework\Module\MagentoWebDriver;

class QrCodeHelper extends Helper
{
    public function verifyText(string $cssSelector, string $resultExpected): void
    {
        /** @var MagentoWebDriver $magentoWebDriver */
        /** @var FacebookWebDriver $webDriver */
        $magentoWebDriver = $this->getModule('\Magento\FunctionalTestingFramework\Module\MagentoWebDriver');
        $webDriver = $magentoWebDriver->webDriver;

        $name = uniqid(date("Y-m-d_H-i-s_"));
        $debugDir = codecept_log_dir() . 'debug';
        if (!is_dir($debugDir)) {
            mkdir($debugDir, 0777);
        }
        $screenShotQr = $debugDir . DIRECTORY_SEPARATOR . $name . '.png';

        $elementQr = $webDriver->findElement(WebDriverBy::cssSelector($cssSelector));
        $elementQr->takeElementScreenshot($screenShotQr);

        $result = (new QRCode)->readFromFile($screenShotQr);
        $resultActual = $result->data;

        $this->assertEquals($resultExpected, $resultActual, 'QR code does not contain the link');
    }
}
