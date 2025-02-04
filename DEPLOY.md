## Code sniffer

```shell
phpcs --standard=Magento2 --extensions=php,phtml --error-severity=10 --ignore-annotations  --report=json --report-file=report.json <module_path>
```

## Copy mass detector 

```shell
phpcpd <module_path>
```

## Zip the package

```shell
./create-package
```
