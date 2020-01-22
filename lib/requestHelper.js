import { queryString, _ } from 'golgoth';
import cookie from 'cookie';

const request = function(rawRequest) {
  return {
    /**
     * Returns the data passed through the request
     * @returns {object} Object representing the data with a .query, .form and
     * .cookies keys
     **/
    getData() {
      const query = this.getQueryStringData(rawRequest);
      const form = this.getFormData(rawRequest);
      const cookieData = this.getCookieData(rawRequest);
      return {
        query,
        form,
        cookie: cookieData,
      };
    },
    /**
     * Returns the data passed in query string
     * @returns {object} Object representing the data
     **/
    getQueryStringData() {
      return _.get(rawRequest, 'queryStringParameters', {});
    },
    /**
     * Returns the data passed as a form
     * @returns {object} Object representing the data
     **/
    getFormData() {
      const body = _.get(rawRequest, 'body', '');
      return queryString.parse(body);
    },
    /**
     * Returns the data passed from the cookies
     * @returns {object} Object representing the data
     **/
    getCookieData() {
      const cookies = _.get(rawRequest, 'headers.cookie', '');
      return cookie.parse(cookies);
    },
  };
};
export default request;
