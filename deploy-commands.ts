import { SlashCommandBuilder, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'

import * as dotenv from 'dotenv'
dotenv.config()

const commands = [
  new SlashCommandBuilder().setName('help').setDescription('Helps about bot commands'),
  new SlashCommandBuilder().setName('addcoremember').setDescription('Core Team rolü verir.')
    .addUserOption(option => option.setName('user').setDescription('Core Team\'e eklemek istediğiniz kullanıcı').setRequired(true)),
  new SlashCommandBuilder().setName('deletecoremember').setDescription('Core Team rolünü kaldırır/siler.')
    .addUserOption(option => option.setName('user').setDescription('Core Team rolünü kaldırmak istediğiniz kullanıcı').setRequired(true))
]
  .map(command => command.toJSON())

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!)

rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands })
  .then((data) => console.log('Successfully registered application commands.'))
  .catch(console.error)
