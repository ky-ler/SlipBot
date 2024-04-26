import { Client, Events, GatewayIntentBits } from "discord.js";
import { DISCORD_TOKEN } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deployCommands";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async () => {
  await deployCommands();
  console.log("Ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (!commandName) return;

  try {
    if (commands[commandName as keyof typeof commands]) {
      await commands[commandName as keyof typeof commands].execute(
        interaction as any
      );
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(DISCORD_TOKEN);
