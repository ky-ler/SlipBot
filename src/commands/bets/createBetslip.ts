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

    const link = interaction.options.getString("fanduel_link");

    console.log(interaction);

    const fdPrefix =
      "https://account.sportsbook.fanduel.com/sportsbook/addToBetslip?";
    if (
      !link ||
      (link && !link.includes(fdPrefix) && !link.includes(scoresAndOddsPrefix))
    ) {
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

    // Create embed and send it to the channel where the command was used
    const embed: IEmbed = {
      description: `Place [this bet](${betslipLink}) now on FanDuel. Good luck! 🍀`,
      timestamp: new Date().toISOString(),
      fields: [],
    };

    const units = interaction.options.getString("units");
    if (units) {
      embed["fields"] = [{ name: "Units", value: units, inline: true }];
    }

    if (!interaction.guild) return;
    const channel = interaction.guild.channels.cache.get(interaction.channelId);

    if (!channel) return;
    await (channel as TextChannel).send({ embeds: [embed] });
  },
};

export { createBetslip };
