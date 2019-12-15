import cdk = require('@aws-cdk/core');
import { ARecord, RecordTarget, HostedZone } from '@aws-cdk/aws-route53';
import {CloudFrontWebDistribution} from '@aws-cdk/aws-cloudfront'

interface StackProps extends cdk.StackProps{
  hostname: string
  distribution: CloudFrontWebDistribution
}

export class Route53Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new ARecord(this, 'VpnARecord', {
      target: RecordTarget.fromValues(props.distribution.domainName),
      zone: HostedZone.fromLookup(this, 'existing_hostzone', { domainName: props.hostname }),
      recordName: `ive.${props.hostname}`
    })
  }
}
