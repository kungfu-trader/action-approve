const lib = (exports.lib = require('./lib.js'));
const core = require('@actions/core');
const github = require('@actions/github');

const main = async function () {
  const context = github.context;
  const pullRequestNumber = context.payload.pull_request.number;
  const argv = {
    token: core.getInput('token'),
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    pullRequestNumber: pullRequestNumber,
    branch: context.payload.pull_request.base.ref,
  };
  console.log(JSON.stringify(github.context));

  console.log('token length:', argv.token.length, 'branch', argv.branch);

  if (argv.repo == 'test-rollback-packages') {
    await lib.approveAndMerge(argv);
  }
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    // 设置操作失败时退出
    core.setFailed(error.message);
  });
}
