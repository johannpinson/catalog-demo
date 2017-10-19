import del from 'del'
import path from 'path'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import autoprefixer from 'autoprefixer'
import tildeImporter from 'node-sass-tilde-importer'
import cssnano from 'cssnano'
import browserSync from 'browser-sync'
import { name, author, version } from './package.json'

const appDir = 'app/'
const destDir = 'build/'
const paths = {
  styles: {
    src: `${appDir}styles/index.scss`,
    watch: `${appDir}styles/**/*.scss`,
    dest: `${destDir}assets/`,
    options: {
      importer: tildeImporter,
    },
  },
  scripts: {
    src: `${appDir}scripts/index.js`,
    srcVendors: [
      'node_modules/modal-vanilla/dist/modal.min.js',
    ],
    watch: `${appDir}scripts/**/*.js`,
    dest: `${destDir}assets/`,
  },
  views: {
    src: `${appDir}views/*.pug`,
    watch: `${appDir}views/**/*.pug`,
    dest: `${destDir}`,
    opts: {
      pretty: true,
    },
  },
  sprite: {
    src: `${appDir}assets/sprite/*.svg`,
    dest: `${destDir}assets/`,
  },
  content: {
    data: `${appDir}assets/data/**/*`,
    fonts: `${appDir}assets/fonts/*`,
    medias: `${appDir}assets/medias/**/*.{jpg,png,gif,svg}`,
  },
}
const banner =
`/*!
 * ${name}
 * @author: ${author}
 * @date: ${new Date().getFullYear()}
 * @copyright: All rights reserved, ${new Date().getFullYear()} ${author}
 * v${version}
 */`

const plugins = gulpLoadPlugins()
const server = browserSync.create()
const serve = (done) => {
  server.init({
    // open: false,
    server: {
      baseDir: destDir,
    },
  })
  done()
}
const reload = (done) => {
  server.reload()
  done()
}


export const clean = () => del([`${destDir}/*`])

export const copy = () =>
  gulp
    .src([
      paths.content.data,
      paths.content.fonts,
      paths.content.medias,
    ], { base: 'app/assets/' })
    .pipe(gulp.dest(`${destDir}/assets`))

export const sprite = () =>
  gulp
    .src(paths.sprite.src)
    .pipe(plugins.plumber())
    .pipe(plugins.svgmin((file) => {
      const prefix = path.basename(file.relative, path.extname(file.relative))
      return {
        plugins: [{
          cleanupIDs: {
            prefix: `${prefix}-`,
            minify: true,
          },
        }],
      }
    }))
    .pipe(plugins.svgstore({ inlineSvg: true }))
    .pipe(plugins.cheerio(($) => {
      $('svg').prepend(
        '<defs>' +
        '<style>' +
        '.img { display: none }' +
        '.img:target { display: inline }' +
        '</style>' +
        '</defs>',
      )
      Array.prototype.forEach.call($('symbol'), (el) => {
        const $node = $(el);
        const symbol = $(el).clone();
        el.tagName = 'svg'; // eslint-disable-line no-param-reassign
        $node
          .html(
            `${$(symbol).clone().append()}
<g id="bg-${$node.attr('id')}" class="img">${$node.html()}</g>`,
          )
          .removeAttr('id')
      });
    }))
    .pipe(gulp.dest(paths.sprite.dest))

export const styles = () =>
  gulp
    .src(paths.styles.src)
    .pipe(plugins.plumber({
      errorHandler: (error) => {
        plugins.notify.onError('CSS Error: <%= error.message %>')(error)
      },
    }))
    .pipe(plugins.util.env.production ? plugins.util.noop() : plugins.sourcemaps.init())
    .pipe(plugins.sass(paths.styles.options))
    .pipe(plugins.postcss([autoprefixer]))
    .pipe(plugins.util.env.production ? plugins.util.noop() : plugins.sourcemaps.write())
    .pipe(plugins.util.env.production ?
      plugins.postcss([cssnano({
        reduceIdents: {
          keyframes: false,
        },
        discardUnused: {
          keyframes: false,
        },
      })]) :
      plugins.util.noop())
    .pipe(plugins.util.env.production ? plugins.header(banner) : plugins.util.noop())
    .pipe(plugins.util.env.production ? plugins.hash({ template: '<%= hash %><%= ext %>' }) : plugins.util.noop())
    .pipe(gulp.dest(paths.styles.dest))

export const scripts = () =>
  gulp
    .src(paths.scripts.src)
    .pipe(plugins.plumber({
      errorHandler: (error) => {
        plugins.notify.onError('JS Error: <%= error.message %>')(error)
      },
    }))
    .pipe(plugins.util.env.production ? plugins.util.noop() : plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.util.env.production ? plugins.util.noop() : plugins.sourcemaps.write())
    .pipe(plugins.util.env.production ? plugins.header(banner) : plugins.util.noop())
    .pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
    .pipe(plugins.util.env.production ? plugins.hash({ template: 'index.<%= hash %><%= ext %>' }) : plugins.util.noop())
    .pipe(gulp.dest(paths.scripts.dest))

export const scriptsVendors = () =>
  gulp
    .src(paths.scripts.srcVendors)
    .pipe(plugins.concat('vendors.js'))
    .pipe(plugins.plumber({
      errorHandler: (error) => {
        plugins.notify.onError('JS Error: <%= error.message %>')(error)
      },
    }))
    .pipe(plugins.util.env.production ? plugins.util.noop() : plugins.sourcemaps.init())
    .pipe(plugins.util.env.production ? plugins.util.noop() : plugins.sourcemaps.write())
    .pipe(plugins.util.env.production ? plugins.header(banner) : plugins.util.noop())
    .pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
    .pipe(plugins.util.env.production ? plugins.hash({ template: 'vendors.<%= hash %><%= ext %>' }) : plugins.util.noop())
    .pipe(gulp.dest(paths.scripts.dest))

export const views = () =>
  gulp
    .src(paths.views.src)
    .pipe(plugins.plumber({
      errorHandler: (error) => {
        plugins.notify.onError('Views Error: <%= error.message %>')(error)
      },
    }))
    .pipe(plugins.pug(paths.views))
    .pipe(plugins.inject(
      gulp.src([
        'assets/*.css',
        'assets/vendors*.js',
        'assets/index*.js',
        'assets/*.js',
      ], { cwd: `${__dirname}/${destDir}` }),
      { removeTags: true },
    ))
    // .pipe(plugins.inject(
    //   gulp.src('assets/sprite.svg', { cwd: `${__dirname}/${destDir}` }),
    //   { removeTags: true, transform: (filePath, file) => file.contents.toString() },
    // ))
    .pipe(gulp.dest(paths.views.dest))

export const watch = () => {
  gulp.watch(paths.scripts.watch, gulp.series(scripts, reload))
  gulp.watch(paths.styles.watch, gulp.series(styles, reload))
  gulp.watch(paths.views.watch, gulp.series(views, reload))
  gulp.watch(paths.sprite.src, gulp.series(sprite, views, reload))
  gulp.watch([
    paths.content.data,
    paths.content.fonts,
    paths.content.medias,
  ], gulp.series(copy, reload))
}

export const build = gulp.series(
  clean,
  copy,
  sprite,
  gulp.parallel([styles, scripts, scriptsVendors]),
  views,
)
export const run = gulp.series(build, gulp.parallel(watch, serve))

export default run
