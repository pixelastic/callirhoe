const current = require('../airtable');

describe('airtable', () => {
  describe('init', () => {
    beforeEach(async () => {
      current.base = null;
    });
    it('should init airtable and default base', async () => {
      jest.spyOn(current, '__configure').mockReturnValue();
      jest.spyOn(current, '__base').mockReturnValue('full base');

      current.init('foo', 'bar');

      expect(current.__configure).toHaveBeenCalledWith({ apiKey: 'foo' });
      expect(current.__base).toHaveBeenCalledWith('bar');
      expect(current.base).toEqual('full base');
    });
  });
  describe('find', () => {
    let mockResults;
    let mockSelect;
    let mockBase;
    beforeEach(async () => {
      mockResults = jest.fn();
      mockSelect = jest.fn().mockReturnValue({ firstPage: mockResults });
      mockBase = jest.fn().mockReturnValue({ select: mockSelect });
      current.base = mockBase;
    });
    it('should return false if no matches', async () => {
      mockResults.mockReturnValue([]);
      const actual = await current.find('foo');

      expect(actual).toEqual(false);
    });
    it('should return the first element if matches', async () => {
      mockResults.mockReturnValue(['bar', 'baz']);
      const actual = await current.find('foo');

      expect(actual).toEqual('bar');
    });
    it('should select in the specified table', async () => {
      await current.find('foo');

      expect(current.base).toHaveBeenCalledWith('foo');
    });
    it('should select one criteria', async () => {
      await current.find('foo', { bar: 'baz' });

      expect(mockSelect).toHaveBeenCalledWith(
        expect.objectContaining({ filterByFormula: 'bar = "baz"' })
      );
    });
    it('should select on several criteria', async () => {
      await current.find('foo', { bar: 'baz', baz: 'quxx' });

      expect(mockSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          filterByFormula: 'AND(bar = "baz",baz = "quxx")',
        })
      );
    });
  });
  describe('add', () => {
    let mockCreate;
    let mockBase;
    beforeEach(async () => {
      mockCreate = jest.fn().mockReturnValue([]);
      mockBase = jest.fn().mockReturnValue({ create: mockCreate });
      current.base = mockBase;
    });
    it('should add to the specified table', async () => {
      await current.add('foo', { foo: 'bar' });

      expect(current.base).toHaveBeenCalledWith('foo');
    });
    it('should create one new element', async () => {
      await current.add('foo', { foo: 'bar' });

      expect(mockCreate).toHaveBeenCalledWith([{ fields: { foo: 'bar' } }]);
    });
    it('should return the created element', async () => {
      mockCreate.mockReturnValue(['foo']);

      const actual = await current.add('foo', { foo: 'bar' });

      expect(actual).toEqual('foo');
    });
  });
});
