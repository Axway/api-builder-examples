const getPlugin = require('../src');
const actions = require('../src/actions');
const { expect } = require('chai');
const simple = require('simple-mock');
const { MockRuntime } = require('@axway/api-builder-sdk');

describe('flow-node logger', () => {
	let runtime;
	before(async () => runtime = new MockRuntime(await getPlugin()));

	beforeEach(() => {
		simple.restore();
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.log).to.be.a('function');
			expect(runtime).to.exist;
			const flownode = runtime.getFlowNode('logger');
			expect(flownode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flownode.name).to.equal('Logger');
			expect(flownode.description).to.equal('Logger utility.');
			expect(flownode.category).to.equal('general');
			expect(flownode.icon).to.be.a('string');
			expect(flownode.methods).to.deep.equal({
				log: {
					description: 'Writes to the output log.',
					parameters: {
						level: {
							description: 'The log level to write to.',
							required: false,
							initialType: 'string',
							schema: {
								type: 'string',
								default: 'trace',
								enum: [ 'trace', 'debug', 'warn', 'error', 'time', 'timeEnd' ]
							}
						},
						message: {
							description: 'The log message.',
							required: true,
							initialType: 'string',
							schema: {
								type: 'string'
							}
						}
					},
					outputs: {
						next: {
							name: 'Next',
							schema: {
								type: 'string'
							}
						},
						error: {
							name: 'Error',
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
			expect(runtime.validate()).to.not.throw;
		});
	});

	describe('#hello', () => {
		it('should error when logging at unknown level', async () => {
			// Invoke #hello with a non-number and check error.
			const flowNode = runtime.getFlowNode('logger');

			const result = await flowNode.log({
				level: 'foobar'
			});

			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('error');

			expect(result.args[0]).to.equal(null);
			expect(result.args[1]).to.be.an('Error');
			expect(result.args[1].message).to.equal('invalid log level: foobar')
			expect(result.context).to.be.an('Object');
			expect(result.context.error).to.be.an('Error');
			expect(result.context.error.message).to.equal('invalid log level: foobar');
		});

		it('should log with default log level', async () => {
			simple.mock(console, 'trace', () => {});
			const flowNode = runtime.getFlowNode('logger');

			const result = await flowNode.log({ message: 'Hello' });

			expect(console.trace.callCount).to.equal(1);
			expect(console.trace.lastCall.arg).to.equal('Hello');
			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('next');
			expect(result.args).to.deep.equal([]);
			expect(result.context).to.be.undefined;
		});

		for (const level of [ 'trace', 'debug', 'warn', 'error' ]) {
			it(`should log at log level ${level}`, async () => {
				simple.mock(console, level, () => {});
				const flowNode = runtime.getFlowNode('logger');

				const result = await flowNode.log({
					level,
					message: 'Hello'
				});

				expect(console[level].callCount).to.equal(1);
				expect(console[level].lastCall.arg).to.equal('Hello');
				expect(result.callCount).to.equal(1);
				expect(result.output).to.equal('next');
				expect(result.args).to.deep.equal([]);
				expect(result.context).to.be.undefined;
			});
		}
	});
});
