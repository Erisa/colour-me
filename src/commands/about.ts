/* eslint-disable no-case-declarations */
import { SlashCommand, SlashCreator, CommandContext } from 'slash-create';

export default class BotCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'about',
      description: 'See how to use the bot!'
    });
  }

  async run(ctx: CommandContext) {
    const aboutText = `
      Colour me! is a bot that allows server admins to give users the ability to change the colour of their own assigned colour roles!

      **Server admin commands**:
      \`/colour-role add <role>\`:
      Add a role to the list of roles that are allowed to change their own colour!

      \`/colour-role remove <role>\`:
      Remove a role previously added to the list of allowed roles!

      \`/colour-role list\`:
      See the current list of roles!

      All of these require the \`Manage Roles\` permission.
      Make sure the role you're adding already has a colour before you add it!

      **User commands**:
      \`/colour-me random\`:
      Change your role colour to a random colour!!

      \`/colour-me colour <hexcode>\`:
      Change your role colour to a specific hex code!

      \`/about\`:
      That's this, you're reading it!

      **Planned features**:
      In the near future it is planned to have functionality to allow admins and optionally users to create their own coloured roles automatically.

      **Links**:
      Privacy Policy: TBD
      Support: https://discord.gg/5eTcNpqPph
      Add the bot to your server: [https://erisa.link/colourme](https://discord.com/api/oauth2/authorize?client_id=702660517617205248&permissions=268435456&scope=bot%20applications.commands)

      Made with 💝 by [Erisa](https://erisa.uk) and the help of her wonderful friends.
    `;

    ctx.send({
      embeds: [
        {
          author: {
            name: 'Colour me!',
            icon_url: 'https://pb.erisa.workers.dev/Gr58.png'
          },
          description: aboutText,
          color: 16738740
        }
      ]
    });
  }
}
