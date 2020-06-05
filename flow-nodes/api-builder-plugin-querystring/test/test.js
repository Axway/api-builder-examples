const getPlugin = require('../src');
const actions = require('../src/actions');
const expect = require('chai').expect;
const { MockRuntime } = require('@axway/api-builder-test-utils');

describe('flow-node querystring', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		flowNode = plugin.getFlowNode('querystring');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.encode).to.be.a('function');
			expect(plugin).to.be.an('object');
			expect(flowNode).to.be.a('object');
			expect(flowNode.name).to.equal('Querystring');
			expect(flowNode.description).
				to.equal('The querystring flow-node provides utilities for parsing and formatting URL query strings.');
			expect(flowNode.icon).to.be.a('string');
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

	describe('#encode', () => {
		it('should error when missing parameter', async () => {
			const { value, output } = await flowNode.encode({obj: null});
			expect(output).to.equal('error');
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: obj');
		});

		it('should succeed with valid argument', async () => {
			const obj = { foo: 'bar', baz: ['qux', 'quux'], corge: '' };
			const { value, output } = await flowNode.encode({ obj: obj });
			expect(output).to.equal('next');
			expect(value).to.equal('foo=bar&baz=qux&baz=quux&corge=');
		});
	});

	describe('#decode', () => {
		it('should error when missing parameter', async () => {
			const { value, output } = await flowNode.decode({str: null});
			expect(output).to.equal('error');
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: str');
		});

		it('should succeed with valid argument', async () => {
			const str = 'foo=bar&abc=xyz&abc=123';
			const { value, output } = await flowNode.decode({ str: str });
			expect(output).to.equal('next');
			expect(value).to.deep.equal({
				foo: 'bar',
				abc: ['xyz', '123']
			});
		});
	});	
});
