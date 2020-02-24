const module = require('../requestHelper');

describe('requestHelper', () => {
  describe('getData', () => {
    describe('query', () => {
      it('should return an object of key values', async () => {
        const input = { queryStringParameters: { foo: 'bar', bar: 'baz' } };
        const actual = new module(input).getData();

        expect(actual).toHaveProperty('query.foo', 'bar');
        expect(actual).toHaveProperty('query.bar', 'baz');
      });
    });
    describe('form', () => {
      it('should return an object of key values', async () => {
        const input = { body: 'foo=bar&bar=baz' };
        const actual = new module(input).getData();

        expect(actual).toHaveProperty('form.foo', 'bar');
        expect(actual).toHaveProperty('form.bar', 'baz');
      });
    });
    describe('cookie', () => {
      it('should return an object of key values', async () => {
        const input = { headers: { cookie: 'foo=bar; bar=baz' } };
        const actual = new module(input).getData();

        expect(actual).toHaveProperty('cookie.foo', 'bar');
        expect(actual).toHaveProperty('cookie.bar', 'baz');
      });
    });
  });
});
