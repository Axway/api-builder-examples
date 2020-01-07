const getPlugin = require('../src');
const actions = require('../src/actions');
const expect = require('chai').expect;
const { MockRuntime } = require('@axway/api-builder-sdk');

describe('flow-node querystring', () => {
	let runtime;
	before(async () => runtime = new MockRuntime(await getPlugin()));

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.encode).to.be.a('function');
			expect(runtime).to.exist;
			const flownode = runtime.getFlowNode('querystring');
			expect(flownode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flownode.name).to.equal('Querystring');
			expect(flownode.description).to.equal('The querystring flow-node provides utilities for parsing and formatting URL query strings.');
			expect(flownode.icon).to.be.a('string');
		});

		// It is vital to ensure that the generated node flow-nodes are valid
		// for use in API Builder. Your unit tests should always include this
		// validation to avoid potential issues when API Builder loads your
		// node.
		it('should define valid flow-nodes', () => {
			expect(runtime.validate()).to.not.throw;
		});
	});

	describe('#encode', () => {
		it('should error when missing parameter', async () => {
			// Invoke #hello with a non-number and check error.
			const flowNode = runtime.getFlowNode('querystring');
			const result = await flowNode.encode({obj: null});
			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('error');
			expect(result.args[1]).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: obj');
		});

		it('should succeed with valid argument', async () => {
			const flowNode = runtime.getFlowNode('querystring');
			const obj = { foo: 'bar', baz: ['qux', 'quux'], corge: '' };
			const result = await flowNode.encode({ obj: obj });
			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('next');
			expect(result.args).to.deep.equal([ null, 'foo=bar&baz=qux&baz=quux&corge=' ]);
			expect(result.context).to.deep.equal({
				encodedString: 'foo=bar&baz=qux&baz=quux&corge='
			});
		});
	});

	describe('#decode', () => {
		it('should error when missing parameter', async () => {
			// Invoke #hello with a non-number and check error.
			const flowNode = runtime.getFlowNode('querystring');
			const result = await flowNode.decode({str: null});
			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('error');
			expect(result.args[1]).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: str');
		});

		it('should succeed with valid argument', async () => {
			const flowNode = runtime.getFlowNode('querystring');
			const str = 'foo=bar&abc=xyz&abc=123';
			const result = await flowNode.decode({ str: str });
			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('next');
			expect(result.args).to.deep.equal([ null, {
				foo: 'bar',
				abc: ['xyz', '123']
			}]);
			expect(result.context).to.deep.equal({
				decodedObject: {
					foo: 'bar',
					abc: ['xyz', '123']
				}
			});
		});
	});	
});
