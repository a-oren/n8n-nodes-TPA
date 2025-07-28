import {
	ICredentialType,
	INodeProperties
} from 'n8n-workflow';

export class TrustifyOAuth2Api implements ICredentialType {
	name = 'trustifyOAuth2Api';
	displayName = 'Trustify OAuth2 API';
	documentationUrl = 'https://access.redhat.com/products/red-hat-trusted-profile-analyzer';
	extends = ['oAuth2Api'];
	properties: INodeProperties[] = [
		{ displayName: 'Authorization URL', name: 'authUrl', type: 'string' as const,
		  default: 'https://sso-trustify.apps.cluster.trustification.rocks/realms/chicken/protocol/openid-connect/auth' },
		{ displayName: 'Access Token URL', name: 'accessTokenUrl', type: 'string' as const,
		  default: 'https://sso-trustify.apps.cluster.trustification.rocks/realms/chicken/protocol/openid-connect/token' },
		{ displayName: 'Client ID', name: 'clientId', type: 'string' as const, default: '' },
		{ displayName: 'Client Secret', name: 'clientSecret', type: 'string' as const,
		  typeOptions: { password: true }, default: '' },
		{ displayName: 'Scope', name: 'scope', type: 'string' as const,
		  default: 'read:document create:document' },
		{ displayName: 'Grant Type', name: 'grantType', type: 'hidden' as const,
		  default: 'authorizationCode' },
		{ displayName: 'Authentication', name: 'authentication', type: 'hidden' as const,
		  default: 'header' },
	];
}

