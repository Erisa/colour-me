/* eslint-disable no-case-declarations */
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';

import { locale } from '../localisation';

// eslint-disable-next-line no-undef
declare const kv: KVNamespace;
declare const DISCORD_APP_ID: string;

export default class BotCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: locale.t('colour-me'),
      nameLocalizations: {
        'en-US': locale.t('colour-me', { lng: 'en-US' })
      },
      description: locale.t('colour-me-desc'),
      descriptionLocalizations: {
        'en-US': locale.t('colour-me-desc', { lng: 'en-US' })
      },
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: locale.t('random'),
          description: locale.t('set-a-random-colour'),
          description_localizations: {
            'en-US': locale.t('set-a-random-colour', { lng: 'en-US' })
          }
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: locale.t('colour'),
          name_localizations: {
            'en-US': locale.t('colour', { lng: 'en-US' })
          },
          description: locale.t('set-a-specific-colour'),
          description_localizations: {
            'en-US': locale.t('set-a-specific-colour', { lng: 'en-US' })
          },
          options: [
            {
              type: CommandOptionType.STRING,
              required: true,
              name: locale.t('hexcode'),
              description: locale.t('hexcode-desc'),
              description_localizations: {
                'en-US': locale.t('hexcode-desc', { lng: 'en-US' })
              }
            }
          ]
        }
      ]
    });
  }
  async run(ctx: CommandContext) {
    const kvResult = await kv.get(ctx.guildID!);

    let roleList: string[] = [];

    if (kvResult !== null) {
      roleList = JSON.parse(kvResult);
    }

    const guildRoles: any[] = await this.creator.requestHandler.request('GET', `/guilds/${ctx.guildID}/roles`, true);

    const memberColourRoles = guildRoles.filter((role: any) => {
      return role['color'] != 0 && ctx.member?.roles.includes(role['id']);
    });

    if (memberColourRoles.length == 0) {
      return locale.t('you-dont-have-any-coloured-roles', { lng: ctx.locale });
    }

    const topColouredRole: any = memberColourRoles.sort((firstRole: any, secondRole: any) => {
      return firstRole['position'] > secondRole['position'] ? -1 : 1;
    })[0];

    if (!roleList.includes(topColouredRole['id'])) {
      await ctx.send({
        content: locale.t('your-highest-coloured-role-not-enabled', { roleid: topColouredRole['id'], lng: ctx.locale }),
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
      await ctx.send({
        content: locale.t('no-permission', { lng: ctx.locale, roleid: topColouredRole['id'] }),
        allowedMentions: {
          everyone: false,
          users: false,
          roles: false
        }
      });
      return;
    }

    console.log(ctx.subcommands[0])
    console.log(locale.t('colour', { lng: ctx.locale }))

    switch (ctx.subcommands[0]) {
      case locale.t('random'):
        const newColour = Math.floor(Math.random() * 16777214) + 1;

        await ctx.creator.requestHandler.request(
          'PATCH',
          `/guilds/${ctx.guildID}/roles/${topColouredRole['id']}`,
          true,
          {
            color: newColour
          }
        );

        await ctx.send({
          content: locale.t('okay-i-changed-random', { lng: ctx.locale, roleid: topColouredRole['id'] }),
          allowedMentions: {
            everyone: false,
            users: false,
            roles: false
          }
        });
        return;
      case locale.t('colour'):
        let hexcolour: string = ctx.options[ctx.subcommands[0]].hexcode;
        hexcolour = hexcolour.toLowerCase();

        if (hexcolour[0] == '#') {
          hexcolour = hexcolour.substring(1);
        }

        if (!/^#?[0-9a-f]{6}$/i.test(hexcolour)) {
          return locale.t('not-a-hex-code', { lng: ctx.locale });
        }

        const colourInt: number = parseInt(hexcolour, 16);

        if (colourInt <= 0 || colourInt > 16777215) {
          return locale.t('invalid-hex-code', { lng: ctx.locale });
        }

        await ctx.creator.requestHandler.request(
          'PATCH',
          `/guilds/${ctx.guildID}/roles/${topColouredRole['id']}`,
          true,
          {
            color: colourInt
          }
        );

        await ctx.send({
          content: locale.t('okay-i-changed-specific', {
            lng: ctx.locale,
            roleid: topColouredRole['id'],
            colour: colourInt.toString(16)
          }),
          allowedMentions: {
            everyone: false,
            users: false,
            roles: false
          }
        });
        return;
    }

    return 'An unknown error ocurred processing this command. Please contact the developer.';
  }
}
