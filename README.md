# React Version Detector

a react component to detect new version of application

## Usage
1. define a version.json
    ```json
    {
      "v1.0.0": {}
    }

    ```
1. import that version.json as localVersion in VersionDetector
1. use [copy-webpack-plugin](https://www.npmjs.com/package/copy-webpack-plugin) copy that version.json to output dir, if the url of the version.json is not `/version.json`, you need to set it manually through `url` props
1. run or deploy your application
In the project directory, you can run:
