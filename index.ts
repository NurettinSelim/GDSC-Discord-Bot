import { Client, GatewayIntentBits, GuildMember, Role } from 'discord.js'

import * as dotenv from 'dotenv'
dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(
  'ready',
  () => {
    console.log('Ready!')
  }
)

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  const { commandName } = interaction

  if (commandName === 'help') {
    await interaction.reply('Hi, I\'m here for you! :)')
  } else if (commandName === 'addcoremember') {
    const messageAuthor = interaction.member as GuildMember
    const isLead = messageAuthor.roles.cache.some(role => [process.env.FACILITATOR_ID, process.env.LEAD_ID].includes(role.id))

    const user = interaction.options.getMember('user') as GuildMember

    if (isLead != null) {
      const coreTeamRole = interaction.guild?.roles.cache.find(role => role.id === process.env.CORETEAM_ID) as Role
      await user.roles.add(coreTeamRole)
      await interaction.reply(`<@${user.id}> Core Team Member olarak eklendi`)
    } else {
      await interaction.reply('Bu komutu kullanmak için Lead olmanız gerekir')
    }
  }
})

void client.login(process.env.BOT_TOKEN)
