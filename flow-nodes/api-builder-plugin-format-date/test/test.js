const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-sdk');
const getPlugin = require('../src');
const actions = require('../src/actions');

describe('flow-node format-date', () => {
	let plugin;
	let flowNode;
	before(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		flowNode = plugin.getFlowNode('format-date');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.formatDate).to.be.a('function');
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'format-date'
			]);
			expect(flowNode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flowNode.name).to.equal('Format Date');
			expect(flowNode.description).to.equal('Example flow-node that formats Date. Uses the popular Moment.js library.');
			expect(flowNode.icon).to.be.a('string');
			expect(flowNode.getMethods()).to.deep.equal([
				'formatDate'
			]);
			expect(flowNode.methods).to.deep.equal({
				formatDate: {
					name: 'Format Date',
					description: 'Formats a date. See Moment.js format() method.',
					parameters: {
						date: {
							description: 'The date to be formatted.',
							required: true,
							initialType: 'string',
							schema: {
								type: 'string',
								title: 'Date'
							}
						},
						format: {
							description: 'The desired format. Supports all Moment.js supported formats.',
							required: true,
							initialType: 'string',
							schema: {
								type: 'string',
								title: 'Format'
							}
						}
					},
					outputs: {
						next: {
							name: 'Next',
							description: 'The operation was successful.',
							context: '$.date',
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
			plugin.validate();
		});
	});

	describe('#formatDate method', () => {
		describe('#missing required parameters', () => {
			it('should error when missing parameter - date', async () => {

				const { value, output } = await flowNode.formatDate({
					date: null,
					format: 'LL'
				});
				expect(output).to.equal('error');
				const expectedMessage = 'Missing required parameter: date';
				expect(value).to.be.instanceOf(Error)
					.and.to.have.property('message', expectedMessage);
			});

			it('should error when missing parameter - format', async () => {

				const { value, output } = await flowNode.formatDate({
					date: '2020-01-08T13:24:40+02:00',
					format: null
				});
				expect(output).to.equal('error');
				const expectedMessage = 'Missing required parameter: format';
				expect(value).to.be.instanceOf(Error)
					.and.to.have.property('message', expectedMessage);
			});
		});

		it('should format the input date when passed as string', async () => {

			const { value, output } = await flowNode.formatDate({
				date: '2020-01-08T13:24:40+02:00',
				format: 'L'
			});
			expect(output).to.equal('next');
			expect(value).to.equal('01/08/2020');
		});

		it('should format the input date when passed as Date', async () => {

			const { value, output } = await flowNode.formatDate({
				date: new Date('2020-01-08T13:24:40+02:00'),
				format: 'L'
			});

			expect(output).to.equal('next');
			expect(value).to.equal('01/08/2020');
		});

		/**
		 * Check some of the available formatting that Moment.js provides.
		 */
		it('should format date as expected with different formats', async () => {

			const testDate = '2020-01-08T13:24:40+02:00';
			const testData = [
				{
					format: 'MMMM Do YYYY, h:mm:ss a',
					formatted: 'January 8th 2020, 11:24:40 am'
				},
				{
					format: 'YYYY-MM-DD',
					formatted: '2020-01-08'
				},
				{
					format: 'dddd',
					formatted: 'Wednesday'
				},
				{
					format: 'YYYY [escaped] YYYY',
					formatted: '2020 escaped 2020'
				}
			];
			for (const test of testData) {
				const { value, output } = await flowNode.formatDate({
					date: testDate,
					format: test.format
				});
				expect(output).to.equal('next');
				expect(value).to.equal(test.formatted);
			}
		});

		/**
		 * There is no sanity check on the formats in Moment.js, so an invalid format could be
	     * specified. As this is simply a wrapper node, we expect this to be allowed.
		 */
		it('should NOT fail to format date with invalid input format', async () => {
			
			const invalidFormat = 'clearly-not-a-format';
			const { value, output } = await flowNode.formatDate({
				date: '2020-01-08T13:24:40+02:00',
				format: invalidFormat
			});

			expect(output).to.equal('next');
			// Moments does some transformation based on its defined aliases. The result here is
			const momentResult = 'c1/8/20203amr1/8/20202020-not-am-for0amt';
			expect(value).to.equal(momentResult);
		});

		it('should fail to format an invalid input date', async () => {

			const invalidDate = 'clearly-not-a-date';
			const { value, output } = await flowNode.formatDate({
				date: invalidDate,
				format: 'L'
			});

			const expectedMessage = `Invalid date: '${invalidDate}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});
	});
});
