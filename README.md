[![Code Climate](https://codeclimate.com/github/veloxy/Sourcebox/badges/gpa.svg)](https://codeclimate.com/github/veloxy/Sourcebox)
[![bitHound Score](https://www.bithound.io/github/veloxy/Sourcebox/badges/score.svg)](https://www.bithound.io/github/veloxy/Sourcebox)
[![Build Status](https://travis-ci.org/veloxy/sourcebox.svg?branch=master)](https://travis-ci.org/veloxy/sourcebox)
![Release](https://img.shields.io/github/release/veloxy/sourcebox.svg)

# Sourcebox

This is the source code for my personal website, you can look around but you can not copy. This is only for educational use.

## Requirements

- Node Package Manager (NPM)
- Gulp (`sudo npm install gulp --global`)
- Hexo (`sudo npm install hexo --global`)

## Installation


### Assets

Run `npm install` to install required node modules.

Use Gulp to build and watch changes:

- `gulp` to watch changes changes and start the build process
- `gulp js` to concat all the js files
- `gulp build` to manually start the build process
- `gulp less` to compile less into css.
- `gulp fonts` to move fonts to build directory
- `gulp cleanup` to remove build directory

### Site

Run `npm install` in src directory to install required node modules for hexo.

Run `hexo generate` in the src directory to generate html files.

Run `hexo server` in the src directory to launch a webserver.
