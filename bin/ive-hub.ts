#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { IveHubStack } from '../lib/ive-hub-stack';

const app = new cdk.App();
new IveHubStack(app, 'IveHubStack');
