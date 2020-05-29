const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const actions = require('../src/actions');

describe('flow-node typeof', () => {
	let plugin;
	let flowNode;
	before(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		flowNode = plugin.getFlowNode('getType');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.getType).to.be.a('function');
			expect(plugin).to.be.a('object');
			expect(flowNode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flowNode.name).to.equal('Get Type');
			expect(flowNode.description).to.equal('Gets the type of data');
			expect(flowNode.icon).to.be.a('string');
			expect(flowNode.methods).to.deep.equal({
				getType: {
					name: 'Get Type',
					description: 'Gets the type of data',
					parameters: {
						data: {
							description: 'The data that you want to find the type of.',
							required: true,
							schema: {
								type: 'string',
								title: 'Data'
							}
						}
					},
					outputs: {
						next: {
							name: 'Next',
							description: 'The operation was successful.',
							context: '$.type',
							schema: {
								type: 'string',
								enum: [
									'array',
									'bigint',
									'boolean',
									'function',
									'null',
									'number',
									'object',
									'string',
									'symbol',
									'undefined'
								]
							}
						},
						error: {
							name: 'Error',
							description: 'An unexpected error was encountered.',
							context: '$.error',
							schema: {
								type: 'string'
							}
						}
					}
				}
			});
		});

		// It is vital to ensure that the generated node flow-nodes are valid
		// for use in API Builder. Your unit tests should always include this
		// validation to avoid potential issues when API Builder loads your
		// node.
		it('should define valid flow-nodes', () => {
			// if this is invalid, it will throw and fail
			plugin.validate();
		});
	});

	describe('#hello', () => {
		it('should handle all supported types', async () => {
			
			const data = [
				{
					value: [],
					type: 'array'
				},
				{
					value: 2n,
					type: 'bigint'
				},
				{
					value: true,
					type: 'boolean'
				},
				{
					value: () => {},
					type: 'function'
				},
				{
					value: null,
					type: 'null'
				},
				{
					value: 2,
					type: 'number'
				},
				{
					value: {},
					type: 'object'
				},
				{
					value: '',
					type: 'string'
				},
				{
					value: Symbol(2),
					type: 'symbol'
				},
				{
					type: 'undefined'
				}
			];

			for (const test of data) {
				const { value, output } = await flowNode.getType({
					data: test.value
				});
	
				expect(output).to.equal('next');
				expect(value)
					.to.equal(test.type);
			}
			
		});
	});
});
