/* eslint-disable no-case-declarations */
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';

// eslint-disable-next-line no-undef
declare const kv: KVNamespace;

export default class BotCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'colour-role',
      description: 'Manage the colour role list for this server!',
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'add',
          description: 'Add a colour role to the allowed list',
          options: [
            {
              name: 'role',
              description: 'Role to add to list',
              type: CommandOptionType.ROLE,
              required: true
            }
          ]
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'remove',
          description: 'Remove a colour role from the allowed list',
          options: [
            {
              name: 'role',
              description: 'Role to remove from list',
              type: CommandOptionType.ROLE,
              required: true
            }
          ]
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'list',
          description: 'Show all the configured colour roles'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    if (!ctx.member?.permissions.has(1 << 28)) {
      ctx.send({
        content: 'You need `Manage Roles` permission to use this command.',
        ephemeral: true
      });
      return;
    }

    console.info(ctx.options[ctx.subcommands[0]].role);

    const roleId = ctx.options[ctx.subcommands[0]].role;

    const kvResult = await kv.get(ctx.guildID!);

    let roleList: string[] = [];

    if (kvResult !== null) {
      roleList = JSON.parse(kvResult);
    }

    let embedcontent: string = '';

    switch (ctx.subcommands[0]) {
      case 'add':
        if (roleList.includes(roleId)) {
          ctx.send({
            content: `The role <@&${roleId}> is already in the colour role list!`,
            ephemeral: true
          });
        } else {
          roleList.push(roleId);
          // @ts-ignore
          await kv.put(ctx.guildID, JSON.stringify(roleList));
          await ctx.send({
            content: `I've added <@&${roleId}> to the colour role list!`,
            allowedMentions: {
              everyone: false,
              users: false,
              roles: false
            }
          });
        }
        break;
      case 'remove':
        if (roleList.includes(roleId)) {
          roleList.splice(roleList.indexOf(roleId), 1);
          // @ts-ignore
          await kv.put(ctx.guildID, JSON.stringify(roleList));
          await ctx.send({
            content: `I've removed <@&${roleId}> from the colour role list!`,
            allowedMentions: {
              everyone: false,
              users: false,
              roles: false
            }
          });
        } else {
          ctx.send({
            content: `The role <@&${roleId}> wasn't on the colour role list!`,
            ephemeral: true
          });
        }
        break;
      case 'list':
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

        // @ts-ignore
        await kv.put(ctx.guildID, JSON.stringify(roleList));

        ctx.send({
          content: 'These are all the configured roles.',
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
