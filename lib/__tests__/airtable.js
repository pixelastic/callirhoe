import module from '../airtable';

describe('airtable', () => {
  describe('init', () => {
    beforeEach(async () => {
      module.base = null;
    });
    it('should init airtable and default base', async () => {
      jest.spyOn(module, '__configure').mockReturnValue();
      jest.spyOn(module, '__base').mockReturnValue('full base');

      module.init('foo', 'bar');

      expect(module.__configure).toHaveBeenCalledWith({ apiKey: 'foo' });
      expect(module.__base).toHaveBeenCalledWith('bar');
      expect(module.base).toEqual('full base');
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
      module.base = mockBase;
    });
    it('should return false if no matches', async () => {
      mockResults.mockReturnValue([]);
      const actual = await module.find('foo');

      expect(actual).toEqual(false);
    });
    it('should return the first element if matches', async () => {
      mockResults.mockReturnValue(['bar', 'baz']);
      const actual = await module.find('foo');

      expect(actual).toEqual('bar');
    });
    it('should select in the specified table', async () => {
      await module.find('foo');

      expect(module.base).toHaveBeenCalledWith('foo');
    });
    it('should select one criteria', async () => {
      await module.find('foo', { bar: 'baz' });

      expect(mockSelect).toHaveBeenCalledWith(
        expect.objectContaining({ filterByFormula: 'bar = "baz"' })
      );
    });
    it('should select on several criteria', async () => {
      await module.find('foo', { bar: 'baz', baz: 'quxx' });

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
      module.base = mockBase;
    });
    it('should add to the specified table', async () => {
      await module.add('foo', { foo: 'bar' });

      expect(module.base).toHaveBeenCalledWith('foo');
    });
    it('should create one new element', async () => {
      await module.add('foo', { foo: 'bar' });

      expect(mockCreate).toHaveBeenCalledWith([{ fields: { foo: 'bar' } }]);
    });
    it('should return the created element', async () => {
      mockCreate.mockReturnValue(['foo']);

      const actual = await module.add('foo', { foo: 'bar' });

      expect(actual).toEqual('foo');
    });
  });
});
