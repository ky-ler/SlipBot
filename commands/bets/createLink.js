const { SlashCommandBuilder /*, EmbedBuilder*/ } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-betslip")
    .setDescription("Create mobile friendly betslip link from a FD share link")
    .addStringOption((option) =>
      option
        .setName("fanduel_share_link")
        .setDescription("Paste the link you got from FanDuel here")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("units")
        .setDescription("The amount of units you want to bet")
        .setRequired(false)
    ),

  async execute(interaction) {
    const scoresAndOddsPrefix =
      "https://www.scoresandodds.com/nba/parlay?quickslip=1&";
    const link = interaction.options.getString("fanduel_share_link");
    if (
      !link ||
      (link && !link.includes("fanduel.com/sportsbook/addToBetslip"))
    ) {
      await interaction.reply("Please provide a FanDuel share link");
      return;
    }

    const betslipId = link.split(
      "https://account.sportsbook.fanduel.com/sportsbook/addToBetslip?"
    )[1];
    const betslipLink = `${scoresAndOddsPrefix}${betslipId}`;
    await interaction.reply({
      content: `Created link: ${betslipLink}`,
      ephemeral: true,
    });

    // const embed = new EmbedBuilder()
    //   .setDescription(
    //     `Place [this bet](${betslipLink}) now on FanDuel. Good luck! 🍀`
    //   )
    //   .setTimestamp();

    const embed = {
      description: `Place [this bet](${betslipLink}) now on FanDuel. Good luck! 🍀`,
      timestamp: new Date().toISOString(),
      fields: [],
    };
    const units = interaction.options.getString("units");
    if (units) {
      embed["fields"].push({ name: "Units", value: units, inline: true });
    }

    console.log(embed);

    const channel = interaction.guild.channels.cache.get(interaction.channelId);
    channel.send({ embeds: [embed] });
  },
};
