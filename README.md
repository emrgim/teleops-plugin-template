# TeleOps plugin template

The starting point for a [TeleOps](https://github.com/emrgim/TeleOps) plugin. A plugin adds features to TeleOps — MCP tools for agents, automations on Telegram messages, web addresses for other services — and it is just a **public GitHub repository** that TeleOps installs from its address.

This one, as it is, is a working example:

- an MCP tool, `example_hello`, that greets and lists the bots and Telegram accounts of the TeleOps;
- an automatic answer — `ping` → `pong` in private chats — **off** until you turn it on in its settings;
- a web address, `GET <your TeleOps>/plugins/example/status` (an API key with the `read` scope).

## Make your own

1. Press **Use this template → Create a new repository**. Keep it **public**: TeleOps reads it without an account.
2. In `teleops-plugin.json` change `id` (a-z, 0-9 and `-`; your MCP tools become `<id>_<tool>`), `name`, `description`, `author`, and the settings you need.
3. Write the code in `index.mjs`.
4. Commit and push.
5. In TeleOps: **Connectors → Plugins → +**, paste `https://github.com/<you>/<repo>`, **Check**, **Install**.

After a change: push, then **Check for updates → Update** on the plugin's page in TeleOps.

## Rules

- `teleops-plugin.json` stays at the top of the repository.
- The code runs as it is: TeleOps does not run `npm install`. Node's own modules (`node:crypto`, `node:fs`…) are there; npm packages must be bundled into your file (for example with esbuild).
- `start(ctx)` has 30 seconds, a tool 120, a web address 60. A plugin that fails 20 times in a minute is stopped.
- A plugin runs inside TeleOps with its rights: it can read and send the messages of every bot and account. Say clearly in this README what yours does.

## The plugin API

| | |
|---|---|
| `ctx.settings` | the values of the settings form |
| `ctx.send({ account?, to, text, … })` | send a message |
| `ctx.messages`, `ctx.chats`, `ctx.search` | read chats and messages |
| `ctx.on(type, handler)` | events: `message.received`, `message.sent`, `button.pressed`, … |
| `ctx.tool({ name, description, input, run })` | an MCP tool |
| `ctx.route(method, path, handler, { auth })` | a web address |
| `ctx.store`, `ctx.dataDir` | the plugin's own data |
| `ctx.every`, `ctx.after`, `ctx.log`, `ctx.fetch` | timers, log, HTTP |

Everything, with examples: **[the plugin guide](https://github.com/emrgim/TeleOps/blob/main/docs/plugins.md)**.

## License

MIT
