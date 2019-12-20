import cdk = require('@aws-cdk/core');
import  {CloudFrontWebDistribution, HttpVersion, OriginProtocolPolicy, ViewerCertificate, ViewerProtocolPolicy, CloudFrontAllowedMethods, CloudFrontAllowedCachedMethods,PriceClass} from '@aws-cdk/aws-cloudfront';
import { Bucket } from '@aws-cdk/aws-s3';
import {Certificate} from '@aws-cdk/aws-certificatemanager';

interface StackProps extends cdk.StackProps{
  WebPortalBucket: Bucket
  AcmCertificateArn: string
  WebPortalHostname: string
}

export class CloudfrontStack extends cdk.Stack {
  WebPortalDistribution: CloudFrontWebDistribution
  constructor(scope: cdk.Construct, id: string, props: StackProps) {
    super(scope, id, props);
    
    this.WebPortalDistribution = new CloudFrontWebDistribution(this, 'WebPortalDistribution',{
            originConfigs: [
                {
                  customOriginSource: {
                    domainName: props.WebPortalBucket.bucketWebsiteDomainName,
                    httpPort: 80,
                    httpsPort: 443,
                    originProtocolPolicy: OriginProtocolPolicy.HTTPS_ONLY
                  },
                  behaviors : [
                    {
                      isDefaultBehavior: true,
                      allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
                      cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                      compress: true,
                      forwardedValues: {
                        queryString: true,
                        headers: [
                          'Authorization',
                          'Origin',
                          'Access-Control-Request-Method',
                          'Access-Control-Request-Headers'
                        ]
                      }
                    }
                  ],
                }
            ],
            httpVersion: HttpVersion.HTTP2,
            defaultRootObject: 'index.html',
            viewerCertificate: ViewerCertificate.fromAcmCertificate(Certificate.fromCertificateArn(this, 'ExistingAcmCertificate',props.AcmCertificateArn)),
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            priceClass: PriceClass.PRICE_CLASS_ALL
        })
  }
}
