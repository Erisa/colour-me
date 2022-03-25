/* eslint-disable no-case-declarations */
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext, ComponentContext, RequestHandler, Creator } from 'slash-create';

export default class BotCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'colour-me',
      description: 'Change the colour of your top role',
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'random',
          description: 'Set a random colour',
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'colour',
          description: 'Set a specific colour',
          options: [
            {
              type: CommandOptionType.STRING,
              name: 'hexcode',
              description: 'An RGB hex code for the colour you want to set.'
            }
          ]
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    // @ts-ignore
    const kvResult = await kv.get(ctx.guildID);

    let roleList: string[] = [];

    if (kvResult !== null) {
      roleList = JSON.parse(kvResult);
    }

    const guildRoles: any[] = await this.creator.requestHandler.request('GET', `/guilds/${ctx.guildID}/roles`, true);

    const memberColourRoles = guildRoles.filter((role: any) => {
      return role['color'] != 0 && ctx.member?.roles.includes(role['id']);
    });

    if (memberColourRoles.length == 0) {
      return "You don't have any coloured roles!\nTo use this command you need a coloured role that has colour-me enabled by an admin.";
    }

    const topColouredRole: any = memberColourRoles.sort((firstRole: any, secondRole: any) => {
      return firstRole['position'] > secondRole['position'] ? -1 : 1;
    })[0];

    if (!roleList.includes(topColouredRole['id'])) {
      ctx.send({
        content: `Your highest coloured role is not enabled for colour-me!\nAn admin needs to use \`/colour-role add\` for <@&${topColouredRole['id']}>`,
        allowedMentions: {
          everyone: false,
          users: false,
          roles: false
        }
      });
      return;
    }

    const botMember = await ctx.creator.requestHandler.request(
      'GET',
      `/guilds/${ctx.guildID}/members/${DISCORD_APP_ID}`
    );

    const botRoles = guildRoles.filter((role: any) => {
      return botMember.roles.includes(role['id']);
    });

    const botTopRoleId: any = botRoles.sort((firstRole: any, secondRole: any) => {
      return firstRole['position'] > secondRole['position'] ? -1 : 1;
    })[0];

    const botTopRole = guildRoles[guildRoles.indexOf(botTopRoleId)];

    if (botTopRole['position'] < topColouredRole['position']) {
      return `I don't have permission to access your top coloured role!\nMake sure my top role is above <@&${topColouredRole['id']}>!`;
    }

    switch (ctx.subcommands[0]) {
      case 'random':
        const newColour = Math.floor(Math.random() * 16777214) + 1;

        await ctx.creator.requestHandler.request(
          'PATCH',
          `/guilds/${ctx.guildID}/roles/${topColouredRole['id']}`,
          true,
          {
            color: newColour
          }
        );

        return `Okay, I changed the colour of <@&${topColouredRole['id']}> to a random colour!`;
      case 'colour':
        let hexcolour: string = ctx.options[ctx.subcommands[0]].hexcode;
        hexcolour = hexcolour.toLowerCase();

        if (hexcolour[0] == '#' ){
          hexcolour = hexcolour.substring(1);
        }

        if (!/^#?[0-9a-f]{6}$/i.test(hexcolour)){
          return "That doesn't look like a hex code!";
        }

        let colourInt: number = parseInt(hexcolour, 16);

        if (colourInt > 16777215){
          return 'The given hex code is invalid!';
        }

        await ctx.creator.requestHandler.request(
          'PATCH',
          `/guilds/${ctx.guildID}/roles/${topColouredRole['id']}`,
          true,
          {
            color: colourInt
          }
        );

        return `Okay, I changed the colour of <@&${topColouredRole['id']}> to \`${colourInt.toString(16)}\`!`;
    }
  }
}
