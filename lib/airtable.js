const airtable = require('airtable');
const _ = require('golgoth/lib/lodash');

module.exports = {
  base: null,
  /**
   * Init Airtable
   * @param {string} apiKey Airtable API Key
   * @param {string} baseID Main base ID
   **/
  init(apiKey, baseID) {
    this.__configure({ apiKey });
    this.base = this.__base(baseID);
  },
  /**
   * Find one record from the specified table matching the filters
   * @param {string} tableID Name of the table to search into
   * @param {object} filters Key/Value pair of filters
   * @returns {object} The matching entry if any, false otherwise
   **/
  async find(tableID, filters) {
    const filterByFormula = _.chain(filters)
      .map((value, key) => {
        return `${key} = "${value}"`;
      })
      .thru((elements) => {
        if (elements.length > 1) {
          return `AND(${elements.join(',')})`;
        }
        return elements[0];
      })
      .value();

    const result = await this.base(tableID)
      .select({
        maxRecords: 1,
        filterByFormula,
      })
      .firstPage();
    return _.isEmpty(result) ? false : result[0];
  },
  /**
   * Add one entry to a table
   * @param {string} tableID Name of the table to add the record to
   * @param {object} fields Fields to set
   * @returns {object} Created object
   **/
  async add(tableID, fields) {
    const result = await this.base(tableID).create([{ fields }]);
    return result[0];
  },
  __configure: airtable.configure,
  __base: airtable.base,
};
