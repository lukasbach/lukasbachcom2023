---  
slug: "/blog/streamlined-obsidian-plugin-development"  
kind: blog  
template: page  
date: "2023-04-28"  
title: "A more streamlined development workflow for Obsidian plugins"  
category: obsidian, obsidian-plugins, development
medium: https://medium.com/@lukasbach/a-more-streamlined-development-workflow-for-obsidian-plugins-2a74b0c57c0f
devto: https://dev.to/lukasbach/a-more-streamlined-development-workflow-for-obsidian-plugins-5hm5
---  

I recently started to play around with [Obsidian](https://obsidian.md/) as note taking app, and am a very big fan of the large availability of community plugins and the open architecture that really allows lots of customizability through plugins. I wanted bridge the gaps of features that I was missing from Obsidian so far, and built two of my own plugins that recently got published in the Obsidian app store: [Obsidian Code Files](https://github.com/lukasbach/obsidian-code-files), a plugin for editing text files with Monaco Editor, the editor instance that powers VSCode, and [Obsidian File Order](https://github.com/lukasbach/obsidian-file-order), a plugin for reordering files in the file tree.

In this short article, I wanted to share some learnings that I gained from building these two plugins, and the setup I ended up with to automate the majority of the development and releasing process, which is what I find somewhat complicated and unintuitive by itself.

## The usual plugin development process
Obsidian provides a [GitHub template repo](https://github.com/obsidianmd/obsidian-sample-plugin) that can be used as starter to build a plugin. It contains a scaffold of what is needed to get started, and some documentation on what needs to be done to develop and release plugin versions, but the entire process feels very manual and has many steps involved.

Let's start by looking into how plugins are distributed and installed: A plugin consists of a `main.js` and a `manifest.json` file, and optionally also a `styles.css` file. When installed, they are stored in the `.obsidian/plugins/pluginname` folder within your vault. To release a new version, a new GitHub release needs to be published, and the plugin files need to be attached to the release. The version in the release needs to be bumped and match the version in the `manifest.json` file. A comprehensive documentation is available in the readme of the [template repo](https://github.com/obsidianmd/obsidian-sample-plugin/blob/master/README.md).

The template repo contains a custom version script which automatically syncs the version in the `package.json` file with the version in the `manifest.json` file, so bumping the version through `npm version` will also bump the manifest file. It also contains an esbuild setup to build and bundle the TypeScript source code into a `main.js` bundle file. However, drafting the GitHub release, making sure it has the right name (since the plugin registry of Obsidian is actually sensitive against the release name), and uploading the files is still a manual process. This is tedious, but can also lead to human failure, for example if you forget to build the plugin beforehand and thus publish an old version, or use an incorrect version.

Also development is inconvenient because there is no perfect way to get the plugin into Obsidian while you develop it. The intended way is to place your entire repo into the plugins folder of your Obsidian vault, so that Obsidian sees the built JS file and directly loads the plugin from there. However, being restricted in where to place the repo is inconvenient for some setups (for example, I have my vault placed in a OneDrive folder, but I don't want to place a repository with a gigantic `node_modules` folder somewhere where it will be synced with a cloud), and also you need to reload the Obsidian UI everytime you make a change.

## Improving the development process
To make development easier, I've opted into using the package  [`obsidian-plugin-cli`](https://www.npmjs.com/package/obsidian-plugin-cli). It is an unofficial utility tool not maintained by Obsidian, and is still marked as Alpha software with the note that it will bring breaking changes in the future. However, I found that it improved the development process greatly, was really easy to use and didn't really have any issues that I encountered.

It replaces the esbuild setup in your plugin project, which previously just build your TypeScript source into a JS bundle, with a more elaborate setup that does many things for you. It wraps an esbuild setup so you don't have to define your own, but more importantly, provides a "watching" dev script that automatically installs your devloped plugin into a local vault of your choosing, and automatically rebuilds it when changes are detected. That means you can place the source code of your plugin anywhere on your machine, and just install your plugin into any arbitrary vault.

That means, that the scripts
```json
{
  "scripts": {
	"dev": "node esbuild.config.mjs",
	"build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production"
  }
}
```

becomes

```json
{
  "scripts": {
	"dev": "obsidian-plugin dev --with-stylesheet src/styles.css src/main.ts",
	"build": "obsidian-plugin build --with-stylesheet src/styles.css src/main.ts"
  }
}
```

The library does the rest for you. It also offers to install a hot-reload plugin into Obsidian, which will automatically to a light reload in Obsidian when you change something locally in your plugin, which is much faster than the full reload you would normally have to do, and also more convenient since you don't need to manually trigger a reload in Obsidian.

## Improving the releasing process
This still left the release process of Obsidian an unconvenient labor that I wanted to improve for my setup. For that, I modified a publishing CLI tool that I worked on at an earlier point to be compatible with the release requirements of Obsidian: [publish-fast](https://github.com/lukasbach/publish-fast). It is a simple npm release wrapper, that supports configuration to automatically run scripts like building or linting beforehands, which can bump the package version, manage changelogs and also create a github release and upload asset files.

`publish-fast` can be configured through a dedicated file, or a `publish` object in the `package.json` file. The necessary setup was installing it through `npm i publish-fast --save-dev` and adding the following to the `package.json` file:

```json
{
  "scripts": {
	"release": "publish-fast",
    "postversion": "node version-bump.mjs"
  },
  "publish": {
    "preScripts": "lint,build",
    "skipPublish": true,
    "releaseAssets": "dist/*",
    "noVersionPrefix": true
  }
}
```

This make the publish process run the lint- and build-script prior to release, skips publishing the package to the NPM registry and uploads the files in the `dist` folder to the created github release. The remaining defaults for the tool do the rest, i.e. the tool automatically creates a GitHub release and bumps the version by default.

I still needed the custom script that syncs the version from `package.json` to `manifest.json`, but moved the execution of that script to a `postversion` script, so it would be automatically called by NPM after the version bump. For completeness, here is the version bump script that is provided by the Obsidian template repo:

```js
import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

// read minAppVersion from manifest.json and bump version to target version
let manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));
```

This is pretty much it, running `npm run release` now automatically bumps the version, builds your assets, and creates a new release on GitHub to which it uploads your assets. If you want to release a new version, you just need to run that script. You could even set it up as a CI pipeline in GitHub actions to run completely automated.

## Recap of the changes made
I'll provide a short recap or guide to which changes I made to set up the plugin development to be as convenient and easy to use as possible. I'll also include two more additions that are more closely related to my personal setup, which you may skip.

- Switch to `obsidian-plugin-cli`
    - Run `npm i obsidian-plugin-cli --save-dev
    - Set the dev and build scripts in the package.json file to
```json
{
  "scripts": {
	"dev": "obsidian-plugin dev --with-stylesheet src/styles.css src/main.ts",
	"build": "obsidian-plugin build --with-stylesheet src/styles.css src/main.ts"
  }
}
```
- Set up releasing through `publish-fast`:
    - Run `npm i publish-fast --save-dev`
    - Add the following to the package.json file
```json
{
  "scripts": {
	"release": "publish-fast",
    "postversion": "node version-bump.mjs"
  },
  "publish": {
    "preScripts": "lint,build",
    "skipPublish": true,
    "releaseAssets": "dist/*",
    "noVersionPrefix": true
  }
}
```
- Set up Volta
    - Optional, this will pin the installation of NodeJs and NPM in your repo to a specific version, to make sure all maintainers stay on the same version and your project is more likely to be stable if you look into it at a very future date.
    - Install Volta
    - Run `volta pin node@lts`, `volta pin npm@lts` in your repo
- Set up a custom EsLint setup
    - Optional, but I opted to use an EsLint setup that contained a prettier configuration and a few stricter rules
    - Run `npm i @lukasbach/eslint-config-deps eslint --save-dev`
    - Add the following to the package.json file
```json
{
  "eslintConfig": {
    "extends": "@lukasbach/base",
    "parserOptions": {
      "project": "./tsconfig.json"
    },
    "ignorePatterns": ["lib", "*.js*"]
  }
}
```

## Summary
Obsidian is a pretty cool tool for note-taking and working with markdown notes, and the big community and easy ways to improve the Obsidian experience through custom plugins is really nice. I tried to improve some aspects of plugin development and automate some of the more tedious aspects of it. I found `obsidian-plugin-cli`, which made development much more convenient, and adopted my own tool `publish-fast` to implement an automated release process that makes it easier to move fast in developing Obsidian plugins.
