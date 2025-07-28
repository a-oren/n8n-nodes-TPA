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
		{ displayName: 'Token URL', name: 'accessTokenUrl', type: 'string' as const,
		  default: 'https://<keycloak>/realms/<realm>/protocol/openid-connect/token' },
		{ displayName: 'Client ID', name: 'clientId', type: 'string' as const, default: '' },
		{ displayName: 'Client Secret', name: 'clientSecret', type: 'string' as const,
		  typeOptions: { password: true }, default: '' },
		{ displayName: 'Scope', name: 'scope', type: 'string' as const,
		  default: 'read:document update:document ...' },
		{ displayName: 'Grant Type', name: 'grantType', type: 'hidden' as const,
		  default: 'clientCredentials' },
	];
}

