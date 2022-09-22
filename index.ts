import { Client, GatewayIntentBits, GuildMember, Role, TextChannel } from 'discord.js'

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
    await interaction.deferReply() // helps to mention without pinging
    await interaction.editReply('Merhaba, eğer bir sorun varsa <@267383033533825035>\'e ulaşabilirsin!')
  } else if (commandName === 'addcoremember') {
    const messageAuthor = interaction.member as GuildMember
    const isLead = messageAuthor.roles.cache.some(role => [process.env.FACILITATOR_ID, process.env.LEAD_ID].includes(role.id))

    const user = interaction.options.getMember('user') as GuildMember

    if (isLead) {
      const coreTeamRole = interaction.guild?.roles.cache.find(role => role.id === process.env.CORETEAM_ID) as Role
      await user.roles.add(coreTeamRole)
      const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID!) as TextChannel

      await logChannel.send(`<@${messageAuthor.id}> tarafından <@${user.id}> kullanıcısına *Core Team Member* rolÜ verildi.`)
      await interaction.reply(`<@${user.id}> Core Team Member olarak eklendi!`)
    } else {
      await interaction.reply('Bu komutu kullanmak için Lead olmanız gerekir!')
    }
  } if (commandName === 'deletecoremember') {
    const messageAuthor = interaction.member as GuildMember
    const isLead = messageAuthor.roles.cache.some(role => [process.env.FACILITATOR_ID, process.env.LEAD_ID].includes(role.id))

    const user = interaction.options.getMember('user') as GuildMember

    if (isLead) {
      const coreTeamRole = interaction.guild?.roles.cache.find(role => role.id === process.env.CORETEAM_ID) as Role
      await user.roles.remove(coreTeamRole)
      const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID!) as TextChannel

      await logChannel.send(`<@${messageAuthor.id}> tarafından <@${user.id}> kullanıcısının *Core Team Member* rolü silindi.`)
      await interaction.reply(`<@${user.id}> Core Team Member rolü silindi!`)
    } else {
      await interaction.reply('Bu komutu kullanmak için Lead olmanız gerekir!')
    }
  }
})

void client.login(process.env.BOT_TOKEN)
