import { SlashCommandBuilder, TextChannel } from "discord.js";
import { ISlashCommand, IEmbed } from "@/discord";

const createBetslip: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("create-betslip")
    .setDescription("Create mobile friendly betslip link from a FD share link")
    .addStringOption((option) =>
      option
        .setName("fanduel_link")
        .setDescription("Paste the link you got from FanDuel here")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("units")
        .setDescription("The amount of units you want to bet")
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const scoresAndOddsPrefix =
      "https://www.scoresandodds.com/nba/parlay?quickslip=1&";

    // using non-null assertion because the option is required
    const link = interaction.options.getString("fanduel_link")!;

    const username = interaction.user.username;

    console.log(
      `'${username}' used '${interaction.commandName}' with link: '${link}'`
    );

    const fdPrefix =
      "https://account.sportsbook.fanduel.com/sportsbook/addToBetslip?";
    if (!link.includes(fdPrefix) && !link.includes(scoresAndOddsPrefix)) {
      await interaction.reply({
        content: "Please provide a FanDuel link",
        ephemeral: true,
      });
      return;
    }

    let betslipLink = "";

    if (link.includes(fdPrefix)) {
      const betslipId = link.split(fdPrefix)[1];
      betslipLink = `${scoresAndOddsPrefix}${betslipId}`;
    } else if (link.includes(scoresAndOddsPrefix)) {
      betslipLink = link;
    }

    await interaction.reply({
      content: `Created link: ${betslipLink}`,
      ephemeral: true,
    });

    // using non-null assertion because the option is required
    const units = interaction.options.getString("units")!;

    // Create embed and send it to the channel where the command was used
    const embed: IEmbed = {
      description: `Place [this bet](${betslipLink}) now on FanDuel.\n\nGood luck! 🍀`,
      timestamp: new Date().toISOString(),
      fields: [
        { name: "Units", value: units, inline: true },
        { name: "From", value: `<@${interaction.user.id}>`, inline: true },
      ],
    };

    if (!interaction.guild) return;
    const channel = interaction.guild.channels.cache.get(interaction.channelId);

    if (!channel) return;
    await (channel as TextChannel).send({ embeds: [embed] });
  },
};

export { createBetslip };
