import cdk = require("@aws-cdk/core");
import path = require("path");
import { CfnRole } from "@aws-cdk/aws-iam";
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  UserPool,
  SignInType,
  UserPoolAttribute,
  UserPoolClient
} from "@aws-cdk/aws-cognito";
import { Function, Code, Runtime } from "@aws-cdk/aws-lambda";
import { Bucket } from "@aws-cdk/aws-s3";

export class CognitoStack extends cdk.Stack {
  UserPool: UserPool;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const PreSignUptrigger = new Function(this, "CognitoPreSignUpTrigger", {
      code: Code.fromAsset(path.join(__dirname, "lambda_function/cognito")),
      runtime: Runtime.NODEJS_12_X,
      handler: "pre-signup.handler"
    });

    const PreTokenGenerationTrigger = new Function(
      this,
      "CognitoPreTokenGenrationTrigger",
      {
        code: Code.fromAsset(path.join(__dirname, "lambda_function/cognito")),
        runtime: Runtime.NODEJS_12_X,
        handler: "pre-token-generation.handler"
      }
    );

    this.UserPool = new UserPool(this, "CognitoUserPool", {
      autoVerifiedAttributes: [UserPoolAttribute.EMAIL],
      signInType: SignInType.EMAIL,
      lambdaTriggers: {
        preSignUp: PreSignUptrigger,
        preTokenGeneration: PreTokenGenerationTrigger
      }
    });

    const userpoolCient = new UserPoolClient(this, "CognitoUserPoolClient", {
      userPool: this.UserPool
    });

    const identityPool = new CfnIdentityPool(this, "CognitoIdentityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: userpoolCient.userPoolClientId,
          providerName: this.UserPool.userPoolProviderName
        }
      ]
    });

    // Provide access to different AWS services or resources for unauthorized identity.
    const IdentityPoolUnauthorizedRole = new CfnRole(
      this,
      "IdentityPoolUnAuthorizedRole",
      {
        assumeRolePolicyDocument: {
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Federated: "cognito-identity.amazonaws.com"
              },
              Action: ["sts:AssumeRoleWithWebIdentity"],
              Condition: {
                StringEquals: {
                  "cognito-identity.amazonaws.com:aud": identityPool.ref
                },
                "ForAnyValue:StringLike": {
                  "cognito-identity.amazonaws.com:amr": "unauthenticated"
                }
              }
            }
          ]
        },
        policies: [
          {
            policyName: "CognitoUnauthorizedPolicy",
            policyDocument: {
              Statement: [
                {
                  Effect: "Allow",
                  Action: ["cognito-sync:*"],
                  Resource: "*"
                }
              ]
            }
          }
        ]
      }
    );

    // Provide access to different AWS services or resources for authorized identity.
    const IdentityPoolAuthorizedRole = new CfnRole(
      this,
      "IdentityPoolAuthorizedRole",
      {
        assumeRolePolicyDocument: {
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Federated: "cognito-identity.amazonaws.com"
              },
              Action: ["sts:AssumeRoleWithWebIdentity"],
              Condition: {
                StringEquals: {
                  "cognito-identity.amazonaws.com:aud": identityPool.ref
                },
                "ForAnyValue:StringLike": {
                  "cognito-identity.amazonaws.com:amr": "authenticated"
                }
              }
            }
          ]
        },
        policies: [
          {
            policyName: "CognitoUnauthorizedPolicy",
            policyDocument: {
              Statement: [
                {
                  Effect: "Allow",
                  Action: ["cognito-sync:*", "cognito-identity:*"],
                  Resource: "*"
                }
              ]
            }
          }
        ]
      }
    );

    // Attach the unaithorized role and authorized role to the Identity Pool
    new CfnIdentityPoolRoleAttachment(this, "CognitoIdentityPoolAttachment", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: IdentityPoolAuthorizedRole.attrArn,
        unauthenticated: IdentityPoolUnauthorizedRole.attrArn
      }
    });
  }
}
