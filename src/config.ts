import dotenv from "dotenv";
dotenv.config();

type Config = {
  GUILD_ID: string;
  CLIENT_ID: string;
  DISCORD_TOKEN: string;
};

const { GUILD_ID, CLIENT_ID, DISCORD_TOKEN } = process.env as Config;

export { GUILD_ID, CLIENT_ID, DISCORD_TOKEN };
