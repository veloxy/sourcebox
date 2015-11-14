[![Code Climate](https://codeclimate.com/github/veloxy/Sourcebox/badges/gpa.svg)](https://codeclimate.com/github/veloxy/Sourcebox)
[![bitHound Score](https://www.bithound.io/github/veloxy/Sourcebox/badges/score.svg)](https://www.bithound.io/github/veloxy/Sourcebox)
[![Build Status](https://travis-ci.org/veloxy/sourcebox.svg?branch=master)](https://travis-ci.org/veloxy/sourcebox)
![Tag](https://img.shields.io/github/tag/veloxy/sourcebox.svg)

# Sourcebox

This is the source code for my personal website, you can look around but you can not copy. This is only for educational use.

![Preview image](docs/img/preview.png)

## Requirements

- Node Package Manager (NPM)
- Gulp (`sudo npm install gulp --global`)

## Installation

Run `npm install` to install required node modules.

Use Gulp to build and watch changes:

- `gulp` to start the build process, watch changes and serve the site on `http://localhost:8000`
- `gulp watch` to watch changes in js, html and css files
- `gulp serve` to serve the site on `http://localhost:8000`
- `gulp js` to concat all the js files
- `gulp build` to manually start the build process
- `gulp less` to compile less into css.
- `gulp fonts` to move fonts to build directory
- `gulp cleanup` to remove build directory
