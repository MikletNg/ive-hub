import cdk = require("@aws-cdk/core");
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";

export class DynamoDbStack extends cdk.Stack {
  UserTable: Table;
  ModuleTable: Table;
  NewsTable: Table;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.UserTable = new Table(this, "UserTable", {
      partitionKey: { name: "uuid", type: AttributeType.STRING },
      sortKey: { name: "student_id", type: AttributeType.NUMBER },
      billingMode: BillingMode.PAY_PER_REQUEST,
      serverSideEncryption: true
    });

    this.ModuleTable = new Table(this, "ModuleTable", {
      partitionKey: { name: "code", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      serverSideEncryption: true
    });

    this.NewsTable = new Table(this, "NewsTable", {
      partitionKey: { name: "slug", type: AttributeType.STRING },
      sortKey: { name: "created_at", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      serverSideEncryption: true
    });
  }
}
