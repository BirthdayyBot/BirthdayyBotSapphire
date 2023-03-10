import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions, container } from '@sapphire/framework';
import { AuditLogEvent, Guild, PermissionFlagsBits } from 'discord.js';
import { DEBUG, IS_CUSTOM_BOT } from '../helpers/provide/environment';
import { sendDMMessage } from '../lib/discord/message';
import { GuideEmbed } from '../lib/embeds';
import generateEmbed from '../helpers/generate/embed';
import { createGuildRequest, enableGuildRequest } from '../helpers/provide/guild';
import joinServerLog from '../helpers/send/joinServerLog';

@ApplyOptions<ListenerOptions>({})
export class UserEvent extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.GuildCreate,
            enabled: true,
        });
    }
    public async run(guild: Guild) {
        container.logger.info(`[EVENT] ${Events.GuildCreate} - ${guild.name} (${guild.id})`);
        DEBUG ? container.logger.debug(`[GuildCreate] - ${guild}`) : null;
        const guild_id = guild.id;
        const inviter = await getBotInviter(guild);
        if (IS_CUSTOM_BOT) {
            // TODO: #26 Create a nice welcome message for custom bot servers
        }
        await createNewGuild(guild_id, inviter);
        if (inviter) {
            await sendGuide(inviter);
        }
        await joinServerLog(guild);
        return;

        async function createNewGuild(guildID: string, inviterID: string | null) {
            const guildEnable: any = await enableGuildRequest(guildID);
            if (guildEnable.affectedRowsCountGuild === 0) {
                return await createGuildRequest(guildID, inviterID);
            }
            return;
        }

        async function sendGuide(user_id: string) {
            const embed = await generateEmbed(GuideEmbed);
            await sendDMMessage(user_id, {
                embeds: [embed],
            });
        }

        async function getBotInviter(guildInformation: Guild): Promise<string | null> {
            if (!guild.members.me!.permissions.has(PermissionFlagsBits.ViewAuditLog)) {
                container.logger.debug(
                    DEBUG ? `[GetBotInviter] ${guildInformation.name} (${guildInformation.id}) - No permission to view audit logs` : '',
                );

                return null;
            }

            try {
                const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.BotAdd });
                const entry = auditLogs.entries.first();
                const inviterID = entry!.executor!.id;
                DEBUG ? container.logger.debug(`[GetBotInviter] ${guild.name} (${guild.id}) - Inviter: ${inviterID}`) : null;
                return inviter;
            } catch (error) {
                return null;
            }
        }
    }
}
