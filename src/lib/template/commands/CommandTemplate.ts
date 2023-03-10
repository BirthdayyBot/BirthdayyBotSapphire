import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import generateEmbed from '../../../helpers/generate/embed';
import { container } from '@sapphire/framework';
import { getCommandGuilds } from '../../../helpers/utils/guilds';
import thinking from '../../discord/thinking';
import replyToInteraction from '../../../helpers/send/response';
import { TemplateCMD } from '../../commands';

@ApplyOptions<Command.Options>({
    name: 'template',
    description: 'Template Command',
    enabled: true,
    runIn: ['GUILD_TEXT'],
    requiredUserPermissions: ['ViewChannel'],
    requiredClientPermissions: ['SendMessages'],
})
export class TemplateCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
        });
    }

    public override async registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(await TemplateCMD(), {
            guildIds: getCommandGuilds('testing'),
        });
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        container.logger.info('testCommand Command');
        await thinking(interaction);
        const embed = await generateEmbed({ title: 'Test', description: 'A Test Command' });
        return await replyToInteraction(interaction, { embeds: [embed] });
    }
}
