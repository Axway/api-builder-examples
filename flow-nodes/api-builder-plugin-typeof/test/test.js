const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-sdk');

const getPlugin = require('../src');
const actions = require('../src/actions');

describe('flow-node typeof', () => {
	let runtime;
	before(async () => runtime = new MockRuntime(await getPlugin()));

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.getType).to.be.a('function');
			expect(runtime).to.exist;
			const flownode = runtime.getFlowNode('getType');
			expect(flownode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flownode.name).to.equal('Get Type');
			expect(flownode.description).to.equal('Gets the type of data');
			expect(flownode.icon).to.be.a('string');
			expect(flownode.methods).to.deep.equal({
				getType: {
					name: 'Get Type',
					description: 'Gets the type of data',
					parameters: {
						data: {
							description: 'The data that you want to find the type of.',
							required: true,
							schema: {}
						}
					},
					outputs: {
						next: {
							name: 'Next',
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
			expect(runtime.validate()).to.not.throw;
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

			const flowNode = runtime.getFlowNode('getType');

			for (const test of data) {
				const result = await flowNode.getType({
					data: test.value
				});
	
				expect(result.callCount).to.equal(1);
				expect(result.output).to.equal('next');
				expect(result.args)
					.to.deep.equal([ null, test.type ]);
				expect(result.context).to.deep.equal({
					type: test.type
				});
			}
			
		});
	});
});
