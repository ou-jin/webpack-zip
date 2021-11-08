'use strict';

const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const compressing = require("compressing");
const stream = process.stdout;
function hook(compiler, hookName, fn) {
  if (compiler.hooks) {
    compiler.hooks[hookName].tap("WebpackBar:" + hookName, fn);
  } else {
    compiler.plugin(hookName, fn);
  }
}
class WebpackZip {
  constructor(options = {}) {
    this.destPath = options.destPath || path.join(process.cwd(), "./dist.gz");
    this.handleError =
      options.handleError ||
      function (e) {
        stream.write(chalk.yellow.bold("┓(;´_｀)┏  zip error!!!" + e));
      };
  }

  apply(compiler) {
    hook(compiler, "done", (params) => {
      const zipStream = new compressing.zip.Stream();
      const targetPath = compiler.outputPath;
      zipStream.addEntry(targetPath);
      zipStream
        .on("error", this.handleError)
        .pipe(fs.createWriteStream(this.destPath))
        .on("error", this.handleError);
      stream.write(
        chalk.green.bold("zip is success in  " + this.destPath + "\n\n")
      );
    });
  }
}
module.exports = WebpackZip;
