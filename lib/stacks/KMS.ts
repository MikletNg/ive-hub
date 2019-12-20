import cdk = require("@aws-cdk/core");
import { Key } from "@aws-cdk/aws-kms";
import { RemovalPolicy } from "@aws-cdk/core";

export class KmsStack extends cdk.Stack {
  UserKey: Key;
  S3Key: Key;
  // dynamodb_key: Key
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.UserKey = new Key(this, "UserKey", {
      removalPolicy: RemovalPolicy.DESTROY,
      enableKeyRotation: true
    });
    this.UserKey.addAlias("IveHub/User");

    this.S3Key = new Key(this, "S3Key", {
      removalPolicy: RemovalPolicy.DESTROY,
      enableKeyRotation: true
    });
    this.S3Key.addAlias("IveHub/S3");

    // this.dynamodb_key = new Key(this, 'DynamoDbKey', {
    //     removalPolicy: RemovalPolicy.DESTROY,
    //     enableKeyRotation: true
    // })
    // this.dynamodb_key.addAlias('IveHub/DynamoDB')
  }
}
