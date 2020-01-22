import SparkPost from 'sparkpost';

export default {
  __client: null,
  init(apiKey) {
    if (!this.__client) {
      this.__client = new SparkPost(apiKey);
    }
    return this.__client;
  },
  async send(address, data) {
    const recipients = [{ address }];
    await this.__client.transmissions.send({
      content: {
        ...data,
      },
      recipients,
    });
  },
};
