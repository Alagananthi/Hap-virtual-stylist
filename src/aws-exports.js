// src/aws-exports.js

const awsExports = {
  Auth: {
    // This is the new structure for Amplify v6
    Cognito: {
      userPoolId: "us-east-1_NsC2fy4it",
      userPoolClientId: "3kdhcqp6kkmtn7p2kpsf0s7dup",
      // This 'loginWith' block is what was missing
      loginWith: {
        oauth: {
          domain: "us-east-1nsc2fy4it.auth.us-east-1.amazoncognito.com",
          scopes: ["openid", "email", "phone"],
          redirectSignIn: [
            "http://localhost:3000/",
            "https://d84l1y8p4kdic.cloudfront.net",
          ],
          redirectSignOut: ["http://localhost:3000/"],
          responseType: "code",
        },
      },
    },
  },
};

export default awsExports;