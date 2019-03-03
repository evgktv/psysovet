"use strict";

const gulp = require("gulp");
const bsync = require("browser-sync");
const pump = require("pump");
const sourcemaps = require("gulp-sourcemaps");
const scss = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const changed = require("gulp-changed");
const gIf = require("gulp-if");
const imagemin = require("gulp-imagemin");
const cachebust = require("gulp-cache-bust");
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");
const fileInclude = require("gulp-file-include");

var dir = {
  builddist: "./tmp/build/",
  build: {
    html: "./tmp/build/",
    js: "./tmp/build/static/js/",
    img: "./tmp/build/static/img/",
    css: "./tmp/build/static/css/",
    fonts: "./tmp/build/static/fonts/",
    pdf: "./tmp/build/static/pdf/"
  },
  dist: {
    html: "dist/",
    js: "dist/static/js/",
    img: "dist/static/img/",
    css: "dist/static/css/",
    fonts: "dist/static/fonts/",
    pdf: "dist/static/pdf/"
  },
  src: {
    html: "src/**/*.html",
    js: "src/js/index.js",
    css: "src/css/*.css",
    scss: "src/scss/style.scss",
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
    pdf: "src/pdf/**/*.*"
  },
  watch: {
    html: "src/**/*.html",
    js: "src/js/**/*.js",
    scss: "src/scss/**/*.scss",
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
    pdf: "src/pdf/**/*.*"
  }
};

var browserSyncConfig = {
  server: {
    baseDir: dir.builddist
  },
  tunnel: false,
  host: "localhost",
  port: 9000,
  logPrefix: "overbuffed-gulp",
  logConnections: true,
  ghostMode: false
};

var isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

var gulpBuildMode = isDevelopment ? "build-dev" : "build-prod";

console.log(
  isDevelopment
    ? "[OVERBUFFED-GULP] Building dev..."
    : "[OVERBUFFED-GULP] Building production..."
);

gulp.task("public", function() {
  return gulp
    .src(["src/favicon.ico", "src/manifest.json", "src/browserconfig.xml"], {
      allowEmpty: true
    })
    .pipe(gulp.dest(isDevelopment ? dir.build.html : dir.dist.html));
});

gulp.task("html", function(cb) {
  return pump(
    [
      gulp.src(dir.src.html).pipe(
        fileInclude({
          prefix: "@@",
          basepath: "src/partials/"
        })
      ),
      gIf(isDevelopment, changed(dir.build.html)),
      cachebust({
        type: "timestamp"
      }),
      gulp.dest(isDevelopment ? dir.build.html : dir.dist.html)
    ],
    cb
  );
});

gulp.task("css", function(cb) {
  return pump(
    [
      gulp.src(dir.src.css, { allowEmpty: true }),
      prefix({
        browsers: ["last 3 versions", "Firefox ESR", "Safari >= 6"]
      }),
      gIf(isDevelopment, changed(dir.build.css)),
      gulp.dest(isDevelopment ? dir.build.css : dir.dist.css)
    ],
    cb
  );
});

gulp.task("scss", function(cb) {
  return pump(
    [
      gulp.src(dir.src.scss),
      gIf(isDevelopment, changed(dir.build.css)),
      gIf(isDevelopment, sourcemaps.init()),
      gIf(
        isDevelopment,
        scss({
          outputStyle: "expanded",
          includePaths: ["./node_modules/"]
        }).on("error", scss.logError)
      ),
      gIf(
        !isDevelopment,
        scss({
          outputStyle: "compressed",
          includePaths: ["./node_modules/"]
        }).on("error", scss.logError)
      ),
      prefix({
        browsers: ["last 3 versions", "Firefox ESR", "Safari >= 6"]
      }),
      gIf(isDevelopment, sourcemaps.write("./")),
      gulp.dest(isDevelopment ? dir.build.css : dir.dist.css)
    ],
    cb
  );
});

gulp.task("js-no-webpack", function(cb) {
  return pump(
    [
      gulp.src(dir.src.js, { allowEmpty: true }),
      gIf(isDevelopment, sourcemaps.init()),
      rename({
        basename: "script"
      }),
      gIf(isDevelopment, sourcemaps.write()),
      gulp.dest(isDevelopment ? dir.build.js : dir.dist.js)
    ],
    cb
  );
});

gulp.task("webpack", function(cb) {
  return pump(
    [
      gulp.src(dir.src.js, { allowEmpty: true }),
      gIf(
        isDevelopment,
        gulpWebpack(require("./webpack.config.dev.js"), webpack)
      ),
      gIf(
        !isDevelopment,
        gulpWebpack(require("./webpack.config.prod.js"), webpack)
      ),
      gulp.dest(isDevelopment ? dir.build.js : dir.dist.js)
    ],
    cb
  );
});

gulp.task("img", function(cb) {
  return pump(
    [
      gulp.src(dir.src.img),
      gIf(isDevelopment, changed(dir.build.img)),
      gIf(
        !isDevelopment,
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 2 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
          })
        ])
      ),
      gulp.dest(isDevelopment ? dir.build.img : dir.dist.img)
    ],
    cb
  );
});

gulp.task("fonts", function(cb) {
  return pump(
    [
      gulp.src(dir.src.fonts, { allowEmpty: true }),
      gIf(isDevelopment, changed(dir.build.fonts)),
      gulp.dest(isDevelopment ? dir.build.fonts : dir.dist.fonts)
    ],
    cb
  );
});

gulp.task("pdf", function(cb) {
  return pump(
    [
      gulp.src(dir.src.pdf, { allowEmpty: true }),
      gIf(isDevelopment, changed(dir.build.pdf)),
      gulp.dest(isDevelopment ? dir.build.pdf : dir.dist.pdf)
    ],
    cb
  );
});

gulp.task("watch", function() {
  gulp.watch(dir.watch.scss, gulp.series("scss"));
  gulp.watch(dir.watch.html, gulp.series("html"));
  gulp.watch(dir.watch.js, gulp.series("webpack"));
  gulp.watch(dir.watch.img, gulp.series("img"));
  gulp.watch(dir.watch.fonts, gulp.series("fonts"));
  gulp.watch(dir.watch.pdf, gulp.series("pdf"));
});

gulp.task("watch-alt", function() {
  gulp.watch(dir.watch.scss, gulp.series("scss"));
  gulp.watch(dir.watch.html, gulp.series("html"));
  gulp.watch(dir.watch.js, gulp.series("js-no-webpack"));
  gulp.watch(dir.watch.img, gulp.series("img"));
  gulp.watch(dir.watch.pdf, gulp.series("pdf"));
});

gulp.task("server", function() {
  bsync.init(browserSyncConfig);
  bsync.watch("tmp/**/*.*").on("change", bsync.reload);
});

gulp.task(
  "build-dev",
  gulp.series(
    "img",
    "scss",
    "css",
    "webpack",
    "fonts",
    "pdf",
    "html",
    "public",
    gulp.parallel("watch", "server")
  )
);

gulp.task(
  "build-prod",
  gulp.series(
    gulp.parallel(
      "img",
      "scss",
      "css",
      "webpack",
      "fonts",
      "html",
      "pdf",
      "public"
    )
  )
);

gulp.task(
  "build-dev-no-webpack",
  gulp.series(
    "img",
    "scss",
    "css",
    "js-no-webpack",
    "fonts",
    "html",
    "pdf",
    "public",
    gulp.parallel("watch-alt", "server")
  )
);

gulp.task(
  "build-prod-no-webpack",
  gulp.series(
    gulp.parallel(
      "img",
      "scss",
      "css",
      "js-no-webpack",
      "fonts",
      "html",
      "pdf",
      "public"
    )
  )
);

gulp.task("default", gulp.series(gulpBuildMode));
