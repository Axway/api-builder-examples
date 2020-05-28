const getPlugin = require('../src');
const actions = require('../src/actions');
const { expect } = require('chai');
const simple = require('simple-mock');
const { MockRuntime, MockLogger } = require('@axway/api-builder-test-utils');

describe('flow-node logger', () => {
	let logger;
	let plugin;
	let flowNode;
	before(async () => {
		logger = await MockLogger.create({ stub: () => simple.stub });
		plugin = await MockRuntime.loadPlugin(getPlugin, {}, { logger });
		flowNode = plugin.getFlowNode('logger');
	});

	beforeEach(() => {
		simple.restore();
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.log).to.be.a('function');
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'logger'
			]);
			expect(flowNode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flowNode.name).to.equal('Logger');
			expect(flowNode.description).to.equal('Logger utility.');
			expect(flowNode.category).to.equal('general');
			expect(flowNode.icon).to.be.a('string');
			expect(flowNode.methods).to.deep.equal({
				log: {
					name: 'Output Log',
					description: 'Writes to the output log.',
					parameters: {
						level: {
							description: 'The log level to write to.',
							required: false,
							initialType: 'string',
							schema: {
								title: 'Loglevel',
								type: 'string',
								default: 'trace',
								enum: [ 'trace', 'debug', 'warn', 'error' ]
							}
						},
						message: {
							description: 'The log message.',
							required: true,
							initialType: 'string',
							schema: {
								title: 'Logmessage',
								type: 'string'
							}
						}
					},
					outputs: {
						next: {
							name: 'Next',
							description: 'The operation was successful.',
							context: '$.log',
							schema: {
								type: 'string'
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
		it('should error when logging at unknown level', async () => {
			const { value, output } = await flowNode.log({
				level: 'foobar'
			});

			expect(output).to.equal('error');

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'invalid log level: foobar');
		});

		it('should log with default log level', async () => {
			simple.mock(logger, 'trace', () => {});	
			const { value, output } = await flowNode.log({
				message: 'Hello'
			});
			
			expect(output).to.equal('next');
			expect(value).to.be.undefined;
		});

		for (const level of [ 'trace', 'debug', 'warn', 'error' ]) {
			it(`should log at log level ${level}`, async () => {
				 
				simple.mock(logger, level, () => {});	
				const { value, output } = await flowNode.log({
					level,
					message: 'Hello'
				});
				expect(logger[level].lastCall.arg).to.equal('Hello');
				expect(output).to.equal('next');
				expect(value).to.be.undefined;
			});
		}
	});
});
