const { Octokit } = require('@octokit/rest');

exports.approveAndMerge = async function (argv) {
  // await updateBranch(argv);
  await approve(argv);
  await merge(argv);
};

const updateBranch = async function (argv) {
  const octokit = new Octokit({
    auth: argv.token,
  });
  try {
    console.log('owner', argv.owner, 'repo', argv.repo, 'pullRequest', argv.pullRequestNumber);
    const up = await octokit.request(
      `PUT /repos/kungfu-trader/${argv.repo}/pulls/${argv.pullRequestNumber}/update-branch`,
      {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    console.log('updateBranch ret:', up);
  } catch (e) {
    console.error(e);
  }
};

const approve = async function (argv) {
  const octokit = new Octokit({
    auth: argv.token,
  });
  try {
    const ret = await octokit.request(
      `POST /repos/${argv.owner}/${argv.repo}/pulls/${argv.pullRequestNumber}/reviews`,
      {
        owner: argv.owner,
        repo: argv.repo,
        pull_number: argv.pullRequestNumber,
        event: 'APPROVE',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    console.log('approve', ret);
  } catch (e) {
    console.error(e);
  }
};

const merge = async function (argv) {
  const octokit = new Octokit({
    auth: argv.token,
  });
  try {
    const ret = await octokit.request(`PUT /repos/kungfu-trader/${argv.repo}/pulls/${argv.pullRequestNumber}/merge`, {
      owner: 'kungfu-trader',
      repo: argv.repo,
      pull_number: 'PULL_NUMBER',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    console.log('merge ret:', ret);
  } catch (e) {
    console.error(e);
  }
};
