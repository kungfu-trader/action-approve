const { Octokit } = require('@octokit/rest');

exports.approveAndMerge = async function (argv) {
  // await updateBranch(argv);
  // await approve(argv);
  await branchProtection(argv, false);
  await merge(argv);
  await branchProtection(argv, true);
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

const branchProtection = async function (argv, isProtect) {
  const octokit = new Octokit({
    auth: argv.token,
  });
  try {
    await octokit.request(`PUT /repos/kungfu-trader/${argv.repo}/branches/${argv.branch}/protection`, {
      owner: 'kungfu-trader',
      repo: argv.repo,
      branch: argv.branch,
      required_status_checks: isProtect
        ? {
            strict: true,
            contexts: ['verify'],
          }
        : null,
      enforce_admins: true,
      required_pull_request_reviews: isProtect
        ? {
            dismissal_restrictions: {
              users: [],
              teams: [],
            },
            dismiss_stale_reviews: true,
            require_code_owner_reviews: false,
            required_approving_review_count: 1,
            require_last_push_approval: false,
            bypass_pull_request_allowances: {
              users: [],
              teams: [],
            },
          }
        : null,
      restrictions: null,
      required_linear_history: false,
      allow_force_pushes: false,
      allow_deletions: false,
      block_creations: false,
      required_conversation_resolution: isProtect,
      lock_branch: false,
      allow_fork_syncing: false,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  } catch (e) {
    console.error('closebranchProtection isProtect:', isProtect, 'error:', e);
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
