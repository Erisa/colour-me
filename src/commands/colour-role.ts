/* eslint-disable no-case-declarations */
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';

// eslint-disable-next-line no-undef
declare const kv: KVNamespace;

import { locale } from '../localisation';

export default class BotCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: locale.t('colour-role'),
      nameLocalizations: {
        'en-US': locale.t('colour-role', { lng: 'en-US' })
      },
      description: locale.t('colour-role-desc'),
      descriptionLocalizations: {
        'en-US': locale.t('colour-role-desc', { lng: 'en-US' })
      },
      defaultPermission: false,
      requiredPermissions: ['MANAGE_ROLES'],
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: locale.t('add'),
          name_localizations: {
            'en-US': locale.t('add', { lng: 'en-US' })
          },
          description: locale.t('add-desc'),
          description_localizations: {
            'en-US': locale.t('add-desc', { lng: 'en-US' })
          },
          options: [
            {
              name: locale.t('role'),
              name_localizations: {
                'en-US': locale.t('role', { lng: 'en-US' })
              },
              description: locale.t('role-add-desc'),
              description_localizations: {
                'en-US': locale.t('role-add-desc', { lng: 'en-US' })
              },
              type: CommandOptionType.ROLE,
              required: true
            }
          ]
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: locale.t('remove'),
          name_localizations: {
            'en-US': locale.t('remove', { lng: 'en-US' })
          },
          description: locale.t('remove-desc'),
          description_localizations: {
            'en-US': locale.t('remove-desc', { lng: 'en-US' })
          },
          options: [
            {
              name: 'role',
              name_localizations: {
                'en-US': locale.t('role', { lng: 'en-US' })
              },
              description: locale.t('role-remove-desc'),
              description_localizations: {
                'en-US': locale.t('role-remove-desc', { lng: 'en-US' })
              },
              type: CommandOptionType.ROLE,
              required: true
            }
          ]
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: locale.t('list'),
          name_localizations: {
            'en-US': locale.t('list', { lng: 'en-US' })
          },
          description: locale.t('role-list-desc'),
          description_localizations: {
            'en-US': locale.t('role-list-desc', { lng: 'en-US' })
          }
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const roleId = ctx.options[ctx.subcommands[0]].role;

    const kvResult = await kv.get(ctx.guildID!);

    let roleList: string[] = [];

    if (kvResult !== null) {
      roleList = JSON.parse(kvResult);
    }

    let embedcontent: string = '';

    switch (ctx.subcommands[0]) {
      case locale.t('add'):
        if (roleList.includes(roleId)) {
          ctx.send({
            content: locale.t('role-already-in-list', { lng: ctx.locale, roleid: roleId }),
            ephemeral: true
          });
        } else {
          var roles: RoleColourStub[] = await ctx.creator.requestHandler.request(
            'GET',
            `/guilds/${ctx.guildID}/roles`
          );

          var role = roles.find(role => role.id == roleId)

          if (!role) {
            await ctx.send({
              content: locale.t('role-error-rare', { lng: ctx.locale }),
              ephemeral: true
            })
            return;
          } else if (role.color == 0) {
            await ctx.send({
              content: locale.t('role-no-colour', { lng: ctx.locale, roleid: roleId }),
              allowedMentions: {
                everyone: false,
                users: false,
                roles: false
              }
            }
            )
            return;
          }

          roleList.push(roleId);
          await kv.put(ctx.guildID!, JSON.stringify(roleList));
          await ctx.send({
            content: locale.t('role-added-to-list', { lng: ctx.locale, roleid: roleId }),
            allowedMentions: {
              everyone: false,
              users: false,
              roles: false
            }
          });
        }
        break;
      case locale.t('remove'):
        if (roleList.includes(roleId)) {
          roleList.splice(roleList.indexOf(roleId), 1);
          await kv.put(ctx.guildID!, JSON.stringify(roleList));
          await ctx.send({
            content: locale.t('role-removed-from-list', { lng: ctx.locale, roleid: roleId }),
            allowedMentions: {
              everyone: false,
              users: false,
              roles: false
            }
          });
        } else {
          ctx.send({
            content: locale.t('role-not-in-list', { lng: ctx.locale, roleid: roleId }),
            ephemeral: true
          });
        }
        break;
      case locale.t('list'):
        if (roleList.length === 0) {
          ctx.send(locale.t('role-list-empty', { lng: ctx.locale }));
          return;
        }

        const guildRoles = await this.creator.requestHandler.request('GET', `/guilds/${ctx.guildID}/roles`, true);
        const guildRoleIds: string[] = [];

        guildRoles.forEach((element: any) => guildRoleIds.push(element['id']));

        roleList.forEach((listRole: string) => {
          if (guildRoleIds.includes(listRole)) {
            embedcontent += ` <@&${listRole}>`;
          } else {
            roleList.splice(roleList.indexOf(listRole), 0);
          }
        });

        await kv.put(ctx.guildID!, JSON.stringify(roleList));

        ctx.send({
          content: locale.t('role-list-header', { lng: ctx.locale }),
          embeds: [
            {
              description: embedcontent
            }
          ]
        });
        break;
    }
  }
}

interface RoleColourStub {
  id: string;
  color: number;
}
