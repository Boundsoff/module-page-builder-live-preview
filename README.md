# PageBuilder Live Preview

1. [About](#about)
2. [Features](#features)
3. [Usage](#usage)
4. [Basic installation](#basic-installation)
5. [Tests](#tests)
6. [Links](#links)

## About

In the original page builder editor when You want to see how the changes looks like in given storefront u gotta save it,
open page and refresh every change U made.

This could lead to small mistakes and hard to make corrections. Also page is normally visible and visible for indexers
or others not to mention performance is lowered by clearing cache all the time.

This module make it simple to work with these issues by adding feature called _Live Preview_, which allows to see the
changes in separate browser window after the change is made without saving anything.

Every window is only available through the link with hash that can be shared or even open it with Your phone which can
accurate see if it fits perfectly.

U can open every storefront available on multiple devices or browsers, and they will update all at once without refresh
the page of those.

## Features

* see the changes made in page builder without any save 
* any storefront preview on separate tab
* any browser to get the preview
* any device to display the changes
* updated in background, no need to refresh the page to see the changes
* private preview without any cache rebuild
* can be share with anyone

## Usage

1. Open content with page builder with fullscreen
2. On the right along with he viewports there is new CTA with live preview
3. Click it and then U will see dialog with store views list with store counter
4. By click any of them U will see details information with details information
   1. U can scan **QR code** with phone camera to open the preview
   2. There is a **link** display for U to use manually
   3. **Copy** button will get this link to Your clipboard and paste everywhere you want to
   4. **Open** button will just open new tab with current browser with the preview
   5. **Back** link will get U back for the list of store views
5. U can **close** dialog by click everywhere else inside of it 

## Basic installation

```shell
composer require boundsoff/module-page-builder-live-preview
```

```shell
php bin/magento module:enable --clear-static-content Boundsoff_PageBuilderLivePreview
```

```shell
php bin/magento setup:di:compile
```

```shell
php bin/magento setup:static-content:deploy
```

## Tests

There are test to be run with the **mftf** [Magento Functional Testing Framework](https://developer.adobe.com/commerce/testing/functional-testing-framework/)

If u got setup this correctly, run it with this command

```shell
vendor/bin/mftf run:group boundsoff_live-preview
```

## Links

1. [Boundsoff](https://boundsoff.com/)
2. [LICENSE](LICENSE.txt)
3. [CHANGELOG](CHANGELOG.md)
