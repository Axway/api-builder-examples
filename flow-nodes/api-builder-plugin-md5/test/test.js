const getPlugin = require('../src');
const actions = require('../src/actions');
const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');

describe('flow-node md5', () => {
	let plugin;
	let flowNode;
	before(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		flowNode = plugin.getFlowNode('md5');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.digest).to.be.a('function');
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'md5'
			]);
			expect(flowNode).to.be.a('object');
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

	describe('#digest', () => {
		it('should fail with invalid argument', async () => {

			const { value, output } = await flowNode.digest({
				data: undefined
			});
			expect(output).to.equal('error');
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'invalid argument: data');
		});

		it('should hash a string', async () => {

			const { value, output } = await flowNode.digest({
				data: 'foo'
			});

			expect(output).to.equal('next');
			expect(value).to.equal('acbd18db4cc2f85cedef654fccc4a4d8');
		});
	});
});
