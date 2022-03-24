import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';

export default class BotCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'hello',
      description: 'Says hello to you.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'food',
          description: 'What food do you like?'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    return ctx.options.food ? `You like ${ctx.options.food}? Nice!` : `Hello, ${ctx.user.username}!`;
  }
}
