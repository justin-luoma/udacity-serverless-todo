// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'i65si6ec8c'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-sz67ap41.us.auth0.com',            // Auth0 domain
  clientId: 'MhfsXIOPyQO9XcFPliOQ2bZ7v4rhrteF',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
