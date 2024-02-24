const fs = require("fs-extra");
const path = require("path");
const login = require("fca-unofficial");
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config.json"), "utf-8"),
);
const state = JSON.parse(
  fs.readFileSync(path.join(__dirname, "state.json"), "utf-8"),
);
const { listen } = require("./includes/listen.js");
const { loadCommands } = require("./includes/handle/loadCommands.js");
const chalk = require("chalk");

global.Sora = new Object({
  config: config,
  botPrefix: config.botPrefix,
  botAdmins: config.botAdmins,
  cmds: loadCommands(),
  events: {},
});

function onBot() {
  login(
    {
      appState: state,
    },
    (err, api) => {
      if (err) return console.error(chalk.red("❌ | Error while logging in: " + err));
      

      api.setOptions(config.option);

      try {
        api.listenMqtt(async (err, event) => {
          if (err)
            return console.error(
              chalk.red("❌ | Error while listening: " + err),
            );

          listen(api, event);
        });
      } catch (error) {
        console.error(chalk.red("❌ | Error while listening: " + error));
      }
    },
  );
}

onBot();
