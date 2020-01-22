import { _ } from 'golgoth';
import cookie from 'cookie';

const response = function() {
  const cookieData = {};
  return {
    /**
     * Add a cookie to the response
     * @param {string} key Cookie key
     * @param {string} value Cookie value
     **/
    addCookie(key, value) {
      _.set(cookieData, key, value);
    },
    /**
     * Returns a value suitable for a Set-Cookie header
     * @returns {string} Set-Cookie value
     **/
    getCookieHeader() {
      return _.chain(cookieData)
        .map((value, key) => {
          return cookie.serialize(key, value);
        })
        .join(',')
        .value();
    },
    /**
     * Returns all the default headers
     * @returns {string} Default headers
     **/
    getHeaders() {
      const headers = {};
      const cookieHeader = this.getCookieHeader();
      if (cookieHeader) {
        headers['Set-Cookie'] = cookieHeader;
      }
      return headers;
    },
    output(body, statusCode = 200) {
      return {
        statusCode,
        headers: this.getHeaders(),
        body,
      };
    },
  };
};
export default response;
