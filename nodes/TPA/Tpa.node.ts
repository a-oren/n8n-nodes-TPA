import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class Tpa implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Trusted Profile Analyzer',
		name: 'tpa',
		icon: 'file:tpa.svg',
		group: ['transform'],
		version: 2,
subtitle: '={{ $display("operation") + " · " + $display("resource") }}',
		description: 'Get data from Trusted Profile Analyzer API',
		defaults: {
			name: 'Trusted Profile Analyzer',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,

		requestDefaults: {
			baseURL:
				'https://server-trustify-latest.apps.cluster.trustification.rocks/.well-known/trustify',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
  {
    displayName: 'Resources',
    name: 'resources',
    type: 'options',
    noDataExpression: true,
    options: [
      { name: 'SBOMs',           value: 'sbom' },
      { name: 'Vulnerabilities', value: 'vulnerability' },
      { name: 'Advisories',      value: 'advisory' },
    ],
    default: 'vulnerability',
  },
  // List vs One
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'List', value: 'list' },
			{ name: 'One',  value: 'one'  },
		],
		default: 'list',
	},

	// ID shows only when "one"
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { mode: ['one'] },
		},
	},

	// Query params only when "list"
	{
		displayName: 'Query Params',
		name: 'query',
		type: 'collection',
		placeholder: 'Add param',
		default: {},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Search',
				name: 'q',
				type: 'string',
				default: '',
			},
		],
		displayOptions: {
			show: { mode: ['list'] },
		},
	},
]
	};
}
