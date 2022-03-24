// This is the slash-up config file.
// Make sure to fill in "token" and "applicationId" before using.

module.exports = {
  // The Token of the Discord bot
  token: '',
  // The Application ID of the Discord bot
  applicationId: '',
  // This is where the path to command files are
  commandPath: './src/commands',
  // You can use different environments with --env (-e)
  env: {
    development: {
      // The "globalToGuild" option makes global commands sync to the specified guild instead.
      globalToGuild: 'XXXXXXXXXXXXXX'
    }
  }
};
