# Catalog Demo

<table>
  <tr>
    <td>
      <img width="77px" alt="Sass logo"   src="http://www.johann-pinson.fr/img/data/wait-and-see-agency.png" />
    </td>
  </tr>
</table>

A simple demo project

* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
  + [NPM Scripts](#npm-scripts)
      * [TL;DR: start and watch](#tldr-to-start-the-server-and-watching-the-assets-run)
* [Documentation](#documentation)
  + [Scripts](#scripts)
    - [Configuration](#configuration)
    - [ES Linter](#es-linter)
  + [Styles](#styles)
    - [Configuration](#configuration-1)
    - [SCSS Linter](#scss-linter)
  + [Views](#views)
* [Git naming convention](#git-naming-convention)

## Requirements
- node-js >= 6.4.0

## Installation
To automate the installation process, we **recommend** that you use the <a href="">wasa-cli</a>, a CLI tool that can initialize ready-to-go new projects based on this boilerplate in no time.

Otherwise, follow these instructions:
- `npm install` to install the dependencies.
- `npm install -g commitizen` to globally install Commitizen.

## Usage

### NPM Scripts
The boilerplate is powered by Gulp, as we are also using services like Babel, Node-Sass, Pug (etc.). You can run each script individually. All main scripts all listed below, but you can also find them in the "scripts" section of the `./package.json` file and `gulpfile.babel.js` configuration.

- `start`: clean the build, build, watch and start server
- `build`: build the assets and the views


##### TL;DR: To start the server while watching the assets, run:
```
npm run start
```

## Documentation

### Scripts

#### Configuration
We are not using nodejs requires as it is not compatible with modern browsers. As a result, import/requires/exports are not allowed. Every JS code must be written inside of a single file, located in `./app/scripts/index.js`

#### ES Linter
We are using the <a href="https://github.com/airbnb/javascript">Airbnb JavaScript Style Guide</a>. You can find the configuration file in `./.eslintrc`. The linter is not passing through our code. Instead, we recommend that you use a package within your text editor:
- Sublime Text: <a href="https://packagecontrol.io/packages/SublimeLinter">SublimeLinter</a>, <a href="https://packagecontrol.io/packages/SublimeLinter-contrib-eslint">SublimeLinter-contrib-eslint</a>, and <a href="https://www.npmjs.com/package/eslint">eslint<a/> (globally installed, `npm install -g eslint`).
- Atom: <a href="https://atom.io/packages/linter">linter</a> and <a href="https://atom.io/packages/linter-eslint">linter-eslint</a>.

### Styles
#### Configuration
Every import is located in `./app/styles/index`. They are separated into five categories:
- abstracts: configuration and helpers.
- base: basic files (reboot, grid etc.).
- components: speaks for itself (e.g. Button).
- layout: layout-related sections (e.g. Header).
- pages: page-specific styles (e.g. homepage).

#### SCSS Linter
We are using the <a href="https://github.com/airbnb/css">Airbnb CSS / Sass Styleguide</a>. You can find the configuration file in `./.scss-lint.yml`. The linter is not passing through our code. Instead, we recommend that you use a package within your text editor:

- Sublime Text: <a href="https://packagecontrol.io/packages/SublimeLinter">SublimeLinter</a>, <a href="https://packagecontrol.io/packages/SublimeLinter-contrib-scss-lint">SublimeLinter-contrib-scss-lint</a>, <a href="https://www.ruby-lang.org/fr/">ruby<a/> and <a href="https://rubygems.org/gems/scss_lint">scss_lint</a>.
- Atom: <a href="https://atom.io/packages/linter">linter</a> and <a href="https://atom.io/packages/linter-scss-lint">linter-scss-lint</a>

### Views
We are using [PugJS](https://pugjs.org/api/getting-started.html) to handle HTML content, a simple framework to quickly produce content.

## Git naming convention
We are using <a href="https://commitizen.github.io/cz-cli/">Commitizen</a> to automate our git messages. Simply add files to your commit and then run the command `git cz`. A prompt will appear and automate your process. By default, we are using the conventionnal-changelog convention (e.g. `'feat(boilerplate): init boilerplate'`). It can be paired with [standard-version](https://github.com/conventional-changelog/standard-version) to automate your changelogs and publishing process.
