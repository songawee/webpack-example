const fs = require("fs");
const path = require("path");
const request = require("request");
const util = require("util");

const readDir = util.promisify(fs.readdir);
const openFile = util.promisify(fs.open);
const readStats = util.promisify(fs.fstat);

async function main() {
  const dirPath = path.resolve(process.cwd(), "./dist");
  const files = await readDir(dirPath);
  const jsFileStats = await Promise.all(
    files
      .filter(file => file.includes(".js") && !file.includes(".map"))
      .map(async file => {
        const filePath = path.resolve(dirPath, file);
        const openedFile = await openFile(filePath, "r");
        const stats = await readStats(openedFile);

        return {
          fileName: file,
          size: stats.size / 1000,
        };
      })
  );

  await http({
    method: "POST",
    uri: process.env.WEBTASK_URL,
    json: {
      stats: jsFileStats,
      meta: {
        username: "songawee",
        repo: "webpack-example",
        pr: process.env.CI_PULL_REQUEST,
      },
    },
  });
}

async function http(opts) {
  return new Promise((resolve, reject) => {
    request(opts, (err, res, body) => {
      if (err || res.statusCode === 500) {
        return reject(err);
      }

      resolve(res);
    });
  });
}

main()
  .then(() => {
    console.log("success");
  })
  .catch(err => {
    console.log("oops", err);
  });
