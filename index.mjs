/**
 * Example TeleOps plugin: an MCP tool, an automatic answer and a web address.
 * Guide: https://github.com/emrgim/TeleOps/blob/main/docs/plugins.md
 *
 * start(ctx) runs when the plugin is turned on (and after an update or a change of its settings).
 * When it stops, TeleOps removes its tools, event handlers, web addresses and timers by itself.
 */
export default {
  async start(ctx) {
    const greeting = String(ctx.settings.greeting || 'Hello')
    const pongs = async () => (await ctx.store.get('pongs')) ?? 0

    // 1. An MCP tool: agents connected to TeleOps see it as example_hello
    ctx.tool({
      name: 'hello',
      title: 'Say hello',
      description: 'Say hello from the example plugin and list the Telegram bots and accounts of this TeleOps. Use it to check that plugins work.',
      scope: 'read',
      input: { type: 'object', properties: { name: { type: 'string', description: 'Who to greet' } } },
      run: async ({ name }) => ({
        text: `${greeting}, ${name || 'there'}!`,
        accounts: ctx.accounts().map((a) => `${a.name} (${a.kind === 'user' ? 'Telegram account' : 'bot'})`),
        pongs: await pongs(),
      }),
    })

    // 2. Messages: answer "ping" with "pong" in private chats — only when the setting is on
    ctx.on('message.received', async (ev) => {
      if (!ctx.settings.autoReply) return
      if (ctx.settings.account && ev.account !== ctx.settings.account) return
      if (ev.data.chatType !== 'private') return
      if (String(ev.data.text ?? '').trim().toLowerCase() !== 'ping') return
      await ctx.send({ account: ev.account, to: ev.data.chat, text: 'pong', replyTo: ev.data.id })
      await ctx.store.set('pongs', (await pongs()) + 1)
      ctx.log.info('answered ping', { chat: ev.data.chat })
    })

    // 3. A web address: GET <your TeleOps>/plugins/example/status with an API key that has the read scope
    ctx.route('GET', 'status', async () => ({ plugin: ctx.plugin.id, commit: ctx.plugin.sha, pongs: await pongs() }), { auth: 'read' })

    ctx.log.info(`started: ${ctx.url('status')}`)
  },
}
