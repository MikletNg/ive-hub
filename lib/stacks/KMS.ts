import cdk = require('@aws-cdk/core');
import { Key } from '@aws-cdk/aws-kms';
import { RemovalPolicy } from '@aws-cdk/core';

export class KmsStack extends cdk.Stack {
    user_key: Key
    s3_key: Key
    // dynamodb_key: Key
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.user_key = new Key(this, 'UserKey', {
            removalPolicy: RemovalPolicy.DESTROY,
            enableKeyRotation: true
        })
        this.user_key.addAlias('IveHub/User')

        this.s3_key = new Key(this, 'S3Key', {
            removalPolicy: RemovalPolicy.DESTROY,
            enableKeyRotation: true
        })
        this.s3_key.addAlias('IveHub/S3')

        // this.dynamodb_key = new Key(this, 'DynamoDbKey', {
        //     removalPolicy: RemovalPolicy.DESTROY,
        //     enableKeyRotation: true
        // })
        // this.dynamodb_key.addAlias('IveHub/DynamoDB')

    }
}
