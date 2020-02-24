const firost = require('firost');

module.exports = {
  /**
   * Import a file and writes it back to disk.
   * This is helpful when building secrets file where values are coming from ENV
   * variables as it will statically write them in the file
   * @param {string} source Path to the source file
   * @param {string} destination Path to the destination file
   **/
  async freezeFile(source, destination) {
    const importedModule = await firost.require(source);
    const staticModule = JSON.stringify(importedModule);
    const content = `module.exports = ${staticModule}`;
    await firost.write(content, destination);
  },
};
