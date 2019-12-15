import cdk = require('@aws-cdk/core');
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';

export class DynamoDbStack extends cdk.Stack {
    user_table: Table
    module_table: Table
    news_table: Table
    user_modules_table: Table

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.user_table = new Table(this, 'UserTable', {
            partitionKey: { name:'uuid', type: AttributeType.STRING },
            sortKey: { name:'student_id', type: AttributeType.NUMBER },
            billingMode: BillingMode.PAY_PER_REQUEST,
            serverSideEncryption: true,
        });

        this.module_table = new Table(this, 'ModuleTable', {
            partitionKey: { name:'code', type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
            serverSideEncryption: true,
        });

        // this.user_modules_table = new Table(this, 'UserModulesTable', {
        //     partitionKey: { name:'module_code', type: AttributeType.STRING },
        //     sortKey: { name:'user_uuid', type: AttributeType.STRING },
        //     billingMode: BillingMode.PAY_PER_REQUEST,
        //     serverSideEncryption: true,
        // });

        this.news_table = new Table(this, 'NewsTable', {
            partitionKey: { name:'slug', type: AttributeType.STRING },
            sortKey: { name:'created_at', type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
            serverSideEncryption: true,
        });
    }
}
