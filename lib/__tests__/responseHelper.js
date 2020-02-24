const module = require('../responseHelper');

describe('responseHelper', () => {
  describe('addCookie', () => {
    it('should add a cookie to the store', async () => {
      const response = new module();
      response.addCookie('foo', 'bar');

      const actual = response.getCookieHeader();
      expect(actual).toEqual('foo=bar');
    });
    it('should overwrite existing cookie', async () => {
      const response = new module();
      response.addCookie('foo', 'bar');
      response.addCookie('foo', 'baz');

      const actual = response.getCookieHeader();
      expect(actual).toEqual('foo=baz');
    });
    it('should allow several values', async () => {
      const response = new module();
      response.addCookie('foo', 'bar');
      response.addCookie('bar', 'baz');

      const actual = response.getCookieHeader();
      expect(actual).toEqual('foo=bar,bar=baz');
    });
  });
  describe('getHeaders', () => {
    it('add the Set-Cookie header if cookies set', async () => {
      const response = new module();
      response.addCookie('foo', 'bar');

      const actual = response.getHeaders();
      expect(actual).toHaveProperty('Set-Cookie', 'foo=bar');
    });
    it('do not add the Set-Cookie header if no cookies set', async () => {
      const response = new module();

      const actual = response.getHeaders();
      expect(actual).not.toHaveProperty('Set-Cookie');
    });
  });
});
