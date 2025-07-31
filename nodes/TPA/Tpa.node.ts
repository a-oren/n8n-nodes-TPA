import { INodeType, INodeTypeDescription, NodeConnectionType, IExecuteFunctions, INodeExecutionData, IHttpRequestOptions } from 'n8n-workflow';

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
    credentials: [
      {
        name: 'trustifyClientCred',
        required: true,
        displayOptions: {
          show: {
            authMethod: ['clientCredentials'],
          },
        },
      },
      {
        name: 'trustifyAuthCode',
        required: true,
        displayOptions: {
          show: {
            authMethod: ['authorizationCode'],
          },
        },
      },
    ],
    requestDefaults: {
      baseURL: 'https://server-trustify-latest.apps.cluster.trustification.rocks/api/v2/',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Authentication Method',
        name: 'authMethod',
        type: 'options',
        options: [
          {
            name: 'Authorization Code',
            value: 'authorizationCode',
          },
          {
            name: 'Client Credentials',
            value: 'clientCredentials',
          },
        ],
        default: 'authorizationCode',
        description: 'Choose how to authenticate to Trustify API',
      },
      {
        displayName: 'Base URL',
        name: 'baseURL',
        type: 'string',
        default: 'https://server-trustify-latest.apps.cluster.trustification.rocks/api/v2/',
        placeholder: 'https://your-trustify-instance.com/api/v2/',
        description: 'The base URL for your Trustify API instance',
        required: true,
      },
      {
        displayName: 'Resources',
        name: 'resources',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'SBOMs', value: 'sbom' },
          { name: 'Vulnerabilities', value: 'vulnerability' },
          { name: 'Advisories', value: 'advisory' },
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
          { name: 'One', value: 'one' },
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
          {
            displayName: 'Sort',
            name: 'sort',
            type: 'string',
            default: '',
            placeholder: 'published:desc',
            description: 'Sort criteria (e.g., published:desc, title:asc)',
          },
        ],
        displayOptions: {
          show: { mode: ['list'] },
        },
      },
    ]
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resources', i) as string;
      const mode = this.getNodeParameter('mode', i) as string;
      const baseURL = this.getNodeParameter('baseURL', i) as string;
      
      // Build the full URL
      let fullUrl = `${baseURL}${resource}`;

      if (mode === 'one') {
        const id = this.getNodeParameter('id', i) as string;
        fullUrl += `/${id}`;
      }

      // Build query parameters for list mode
      let qs = {};
      if (mode === 'list') {
        const queryParams = this.getNodeParameter('query', i) as any;
        qs = queryParams;
      }

      const options: IHttpRequestOptions = {
        method: 'GET' as const,
        url: fullUrl,
        qs,
        returnFullResponse: false,
      };

      const authMethod = this.getNodeParameter('authMethod', 0) as string;

      const credentialName =
        authMethod === 'authorizationCode'
          ? 'trustifyAuthCode'
          : 'trustifyClientCred';

      const response = await this.helpers.httpRequestWithAuthentication.call(
        this,
        credentialName,
        options,
      );

      returnData.push({
        json: response,
        pairedItem: { item: i },
      });
    }

    return [returnData];
  }
}
