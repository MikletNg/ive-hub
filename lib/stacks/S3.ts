import cdk = require("@aws-cdk/core");
import { Bucket, BucketEncryption, BlockPublicAccess } from "@aws-cdk/aws-s3";
import { Key } from "@aws-cdk/aws-kms";

interface StackProps extends cdk.StackProps {
  encryptionKey: Key;
}

export class S3Stack extends cdk.Stack {
  WebPortalBucket: Bucket;
  // www_bucket: Bucket

  constructor(scope: cdk.Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const { encryptionKey } = props;

    this.WebPortalBucket = new Bucket(this, "WebS3Bucket", {
      versioned: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      websiteErrorDocument: "error.html",
      websiteIndexDocument: "index.html",
      encryption: BucketEncryption.KMS,
      encryptionKey
    });
  }
}
