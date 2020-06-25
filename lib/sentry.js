const _ = require('golgoth/lib/lodash');
const Sentry = require('@sentry/node');

module.exports = {
  /**
   * Init sentry
   * @param {string} dsn Sentry unique DSN
   **/
  init(dsn) {
    Sentry.init({ dsn });
  },
  /**
   * Manually trigger an error.
   * @param {string|Error} error Error to log
   * @param {object} userData Additional context data
   */
  async reportError(error, userData = {}) {
    const data = {
      environment: process.env.NODE_ENV,
      ...userData,
    };
    if (_.isString(error)) {
      Sentry.withScope((scope) => {
        _.each(data, (value, key) => {
          scope.setExtra(key, value);
        });
        Sentry.captureMessage(error);
      });
    } else {
      Sentry.captureException(error);
    }

    await Sentry.flush();
  },
  /**
   * Wrapper for Netlify function handlers, so errors are not silently swallowed
   * @param {Function} handler Function handler
   * @returns {Function} Wrapped function
   **/
  wrapHandler(handler) {
    const reportError = this.reportError;
    return async function (request, context) {
      context.callbackWaitsForEmptyEventLoop = false;
      try {
        return await handler.call(this, ...arguments);
      } catch (err) {
        await reportError(err);
        throw err;
      }
    };
  },
};
