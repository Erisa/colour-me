/* eslint-disable no-case-declarations */
import { SlashCommand, SlashCreator, CommandContext } from 'slash-create';

import { locale } from '../localisation';

export default class BotCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: locale.t('about'),
      nameLocalizations: {
        'en-US': locale.t('about', { lng: 'en-US' })
      },
      description: locale.t('about-desc'),
      descriptionLocalizations: {
        'en-US': locale.t('about-desc', { lng: 'en-US' })
      }
    });
  }

  async run(ctx: CommandContext) {
    ctx.send({
      embeds: [
        {
          author: {
            name: 'Colour me!',
            icon_url: 'https://up.erisa.uk/colour-me-icon.png'
          },
          description: locale.t('about-text', { lng: ctx.locale }),
          color: 16738740
        }
      ]
    });
  }
}
