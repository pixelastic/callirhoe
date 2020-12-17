const got = require('golgoth/got');

module.exports = {
  __token: null,
  /**
   * Init CircleCI
   * @param {string} token An authentication token
   **/
  init(token) {
    this.__token = token;
  },
  /**
   * Triggers the specified repo pipeline
   * Note that when triggering a pipeline all workflows are run by default.
   * Chances are high that you only want to trigger a specific one. In that
   * case, you need to add a condition (as a boolean) to each workflow in your
   * config and enable/disable the ones you want to run in your call to
   * triggerPipeline
   * @param {string} repoSlug Repository slug in the form of "{username}/{repo}"
   * @param {object} parameters Parameters to send to the pipeline, used to
   * switch on/off which workflow to trigger
   **/
  async triggerPipeline(repoSlug, parameters) {
    const circleCIUrl = `https://circleci.com/api/v2/project/gh/${repoSlug}/pipeline`;
    await got(circleCIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Circle-Token': this.__token,
      },
      body: JSON.stringify({
        parameters,
      }),
    });
  },
};
