const getPlugin = require('../src');
const actions = require('../src/actions');
const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-sdk');

describe('flow-node md5', () => {
	let runtime;
	before(async () => runtime = new MockRuntime(await getPlugin()));

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.digest).to.be.a('function');
			expect(runtime).to.exist;
			expect(runtime.getFlowNode('md5')).to.exist;
		});

		// It is vital to ensure that the generated node flow-nodes are valid
		// for use in API Builder. Your unit tests should always include this
		// validation to avoid potential issues when API Builder loads your
		// node.
		it('should define valid flow-nodes', () => {
			expect(runtime.validate()).to.not.throw;
		});
	});

	describe('#digest', () => {
		it('should fail with invalid argument', async () => {
			// Invoke #sum and check that the default callback is called,
			// i.e. we expect `cb('invalid argument')` to be called and
			// instruct the flow-engine to abort flow.
			const flowNode = runtime.getFlowNode('md5');

			const result = await flowNode.digest({
				data: undefined
			});

			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('error');
			expect(result.args[0]).to.equal(null);
			expect(result.args[1]).to.be.an('Error');
			expect(result.args[1].message).to.equal('invalid argument: data')
			expect(result.context).to.be.an('Object');
			expect(result.context.error).to.be.an('Error');
			expect(result.context.error.message).to.equal('invalid argument: data');
		});

		it('should hash a string', async () => {
			// Invoke #sum and check that the default callback is called,
			// i.e. we expect `cb('invalid argument')` to be called and
			// instruct the flow-engine to abort flow.
			const flowNode = runtime.getFlowNode('md5');

			const result = await flowNode.digest({
				data: 'foo'
			});

			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('next');
			expect(result.args).to.deep.equal([ null, 'acbd18db4cc2f85cedef654fccc4a4d8' ]);
			expect(result.context).to.deep.equal({
				md5: 'acbd18db4cc2f85cedef654fccc4a4d8'
			});
		});
	});
});
