console.log('Loading forge config');
console.log('NOTORIZE_APPLE_ID', process.env.NOTORIZE_APPLE_ID);

module.exports = {
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "mutex_turbo"
      }
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {
        options: {
          maintainer: 'Bay Foley-Cox',
          homepage: 'https://mutex-remote.web.app/'
        }
      }
    },
    {
      "name": "@electron-forge/maker-dmg",
      "config": {
        "format": "ULFO"
      }
    },
    {
      name: '@electron-forge/maker-zip'
    }
  ],
  "publishers": [
    {
      "name": "@electron-forge/publisher-github",
      "config": {
        "repository": {
          "owner": "Bafoleco",
          "name": "mutex-turbo"
        },
      }
    }
  ],
  "packagerConfig": {
    "osxSign": {
      "identity": "Developer ID Application: James Foley-Cox (3MS68ACDTM)",
      "hardened-runtime": true,
      "entitlements": "./config/entitlements.plist",
      "entitlements-inherit": "./config/entitlements.plist",
      "signature-flags": "library",
      "gatekeeper-assess": false
    },
    "osxNotarize": {
      "appleId": process.env.NOTORIZE_APPLE_ID,
      "appleIdPassword": process.env.NOTORIZE_APPLE_ID_PASSWORD,
      "tool": "notarytool",
      "teamId": "3MS68ACDTM"
    },
    "name": "mutex-turbo",
    "icon": "./assets/icons/icon",
    "protocols": [
      {
        "name": "Mutex Turbo",
        "schemes": [
          "mutex-turbo"
        ]
      }
    ]
  },
  "plugins": [
    [
      "@electron-forge/plugin-webpack",
      {
        "mainConfig": "./webpack.main.config.js",
        "renderer": {
          "config": "./webpack.renderer.config.js",
          "entryPoints": [
            {
              "html": "./src/renderer/index.html",
              "js": "./src/renderer/renderer.ts",
              "name": "main_window",
              "preload": {
                "js": "./src/renderer/preload.ts"
              }
            }
          ]
        }
      }
    ]
  ]
}