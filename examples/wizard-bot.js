// @ts-nocheck
const { Composer, Telegraf, Markup, session, Stage, WizardScene } = require('telegraf')

const stepHandler = new Composer()
stepHandler.action('next', (ctx) => {
  ctx.reply('Step 2. Via inline button')
  return ctx.wizard.next()
})
stepHandler.command('next', (ctx) => {
  ctx.reply('Step 2. Via command')
  return ctx.wizard.next()
})
stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))

const superWizard = new WizardScene('super-wizard',
  (ctx) => {
    ctx.reply('Step 1', Markup.inlineKeyboard([
      Markup.button.url('❤️', 'http://telegraf.js.org'),
      Markup.button.callback('➡️ Next', 'next')
    ]))
    return ctx.wizard.next()
  },
  stepHandler,
  (ctx) => {
    ctx.reply('Step 3')
    return ctx.wizard.next()
  },
  (ctx) => {
    ctx.reply('Step 4')
    return ctx.wizard.next()
  },
  (ctx) => {
    ctx.reply('Done')
    return ctx.scene.leave()
  }
)

const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Stage([superWizard], { default: 'super-wizard' })
bot.use(session())
bot.use(stage.middleware())
bot.launch()
