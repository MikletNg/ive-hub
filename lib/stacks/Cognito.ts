import cdk = require('@aws-cdk/core');
import {UserPool} from '@aws-cdk/aws-cognito';
import {Function} from '@aws-cdk/aws-lambda';

export class CognitoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  }
}
