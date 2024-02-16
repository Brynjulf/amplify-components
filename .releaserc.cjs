const path = require("path");
const fs = require("fs");

const tplFile = path.resolve(
  __dirname,
  "./release/templates/release-notes-template.hbs"
);
const commitFile = path.resolve(
  __dirname,
  "./release/templates/commit-template.hbs"
);
const template = fs.readFileSync(tplFile, "utf-8");
const commitTemplate = fs.readFileSync(commitFile, "utf-8");

const groupedCommits = require("./release/helpers/groupedCommits.cjs");
const RULES = require("./release/utils/rules.cjs");


module.exports = {
  branches: ["main"],
  plugins: [
    [
      "semantic-release-gitmoji",
      {
        releaseRules: RULES,
        releaseNotes: {
          template,
          partials: { commitTemplate },
          helpers: {
            groupedCommits,
          },
          issueResolution: {
            template: "{baseUrl}/{owner}/{repo}/issues/{ref}",
            baseUrl: "https://github.com",
            source: "github.com",
            removeFromCommit: false,
            regex: /#\d+/g,
          },
        },
      },
    ],
    "@semantic-release/github",
    // Generate changelog
    // "@semantic-release/npm",
    // {
    //   npmPublish: false,
    //   tarballDir: "dist",
    // },

    // [
    //   "@semantic-release/changelog",
    //   {
    //     changelogFile: "CHANGELOG.md",
    //     changelogTitle: "# CHANGELOG",
    //   },
    // ],
  ],
};
