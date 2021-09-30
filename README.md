# React Version Detector

a react component to detect new version of application

## Usage
1. use webpack define plugin to inject version in package.json into your app
1. render `<VersionDetector localVersion={version} />`
1. deploy a /version.json which has the below data structure
    ```
    {
      "version": "1.0.0"
    }
    ```
    you can use `generate-json-webpack-plugin` to produce that version.json
1. start your app
