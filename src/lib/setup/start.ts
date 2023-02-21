// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-subcommands/register';
import '@sapphire/plugin-i18next/register';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { inspect } from 'util';
import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import { NODE_ENV, SRC_DIR } from '../../helpers/provide/environment';
// Read env var
config({ path: join(SRC_DIR, `.env.${NODE_ENV}`) });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
