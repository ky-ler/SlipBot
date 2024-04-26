import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  ChatInputCommandInteraction,
  Collection,
  Client,
} from "discord.js";

interface DiscordClient extends Client {
  commands: Collection<string, any>;
  msgCommands: Collection<string, any>;
}

export interface ISlashCommand {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

interface IEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface IEmbed {
  color?: number;
  title?: string;
  url?: string;
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  description?: string;
  thumbnail?: {
    url: string;
  };
  fields?: IEmbedField[];
  image?: {
    url: string;
  };
  timestamp?: string;
  footer?: {
    text: string;
    icon_url?: string;
  };
}
