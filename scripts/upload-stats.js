const fs = require("fs");
const path = require("path");
const util = require("util");
const request = require("request");

const readDir = util.promisify(fs.readdir);
const openFile = util.promisify(fs.open);
const readStats = util.promisify(fs.fstat);

async function main() {
  const dirPath = path.resolve(process.cwd(), "./dist");
  const files = await readDir(dirPath);
  const jsFileStats = await Promise.all(
    files
      .filter(file => {
        // Ignore sourcemaps
        return file.includes(".js") && !file.includes(".map");
      })
      .map(async file => {
        const filePath = path.resolve(dirPath, file);
        const openedFile = await openFile(filePath, "r");
        const stats = await readStats(openedFile);

        return {
          fileName: file,
          stats: stats.size / 1000,
          type: "file",
        };
      })
  );

  console.log(jsFileStats);

  await http({
    method: "POST",
    uri:
      "https://wt-05df8073437afa1c18ea4040f66ff2f9-0.run.webtask.io/webtask-test",
    json: {
      stats: jsFileStats,
      meta: {
        pr: process.env.CI_PULL_REQUEST,
        sha: process.env.CIRCLE_SHA1,
        username: process.env.CIRCLE_PROJECT_USERNAME,
        repo: process.env.CIRCLE_PROJECT_REPONAME,
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
