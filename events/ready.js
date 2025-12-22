module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`🧙‍♂️ Dr Strange is online as ${client.user.tag}`);
  },
};
