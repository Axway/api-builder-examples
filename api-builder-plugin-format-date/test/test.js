const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-sdk');

const getPlugin = require('../src');
const actions = require('../src/actions');

describe('flow-node format-date', () => {
	let runtime;
	before(async () => runtime = new MockRuntime(await getPlugin()));

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(actions).to.be.an('object');
			expect(actions.formatDate).to.be.a('function');
			expect(runtime).to.exist;
			const flownode = runtime.getFlowNode('format-date');
			expect(flownode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flownode.name).to.equal('Format Date');
			expect(flownode.description).to.equal('Example flow-node that formats Date. Uses the popular Moment.js library.');
			expect(flownode.icon).to.be.a('string');
			expect(flownode.methods).to.deep.equal({
				formatDate: {
					name: 'Format Date',
					description: 'Formats a date. See Moment.js format() method.',
					parameters: {
						date: {
							description: 'The date to be formatted.',
							required: true,
							initialType: 'string',
							schema: {
								type: 'string'
							}
						},
						format: {
							description: 'The desired format. Supports all Moment.js supported formats.',
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
							context: '$.date',
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

	describe('#formatDate method', () => {
		describe('#missing required parameters', () => {
			it('should error when missing parameter - date', async () => {
				// Invoke #formatDate with no date.
				const flowNode = runtime.getFlowNode('format-date');

				const result = await flowNode.formatDate({
					date: null,
					format: 'LL'
				});
				expect(result.callCount).to.equal(1);
				expect(result.output).to.equal('error');
				expect(result.args[0]).to.equal(null);

				const expectedMessage = 'Missing required parameter: date';
				expect(result.args[1]).to.be.instanceOf(Error)
					.and.to.have.property('message', expectedMessage);
				expect(result.context).to.be.an('Object');
				expect(result.context.error).instanceOf(Error)
					.and.to.have.property('message', expectedMessage);
			});

			it('should error when missing parameter - format', async () => {
				// Invoke #formatDate with no format.
				const flowNode = runtime.getFlowNode('format-date');

				const result = await flowNode.formatDate({
					date: '2020-01-08T13:24:40+02:00',
					format: null
				});

				expect(result.callCount).to.equal(1);
				expect(result.output).to.equal('error');
				expect(result.args[0]).to.equal(null);
				const expectedMessage = 'Missing required parameter: format';
				expect(result.args[1]).to.be.instanceOf(Error)
					.and.to.have.property('message', expectedMessage);
				expect(result.context).to.be.an('Object');
				expect(result.context.error).instanceOf(Error)
					.and.to.have.property('message', expectedMessage);

			});
		});

		it('should format the input date when passed as string', async () => {
			const flowNode = runtime.getFlowNode('format-date');

			const result = await flowNode.formatDate({
				date: '2020-01-08T13:24:40+02:00',
				format: 'L'
			});

			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('next');
			expect(result.args).to.deep.equal([null, '01/08/2020']);
			expect(result.context).to.deep.equal({
				date: '01/08/2020'
			});
		});

		it('should format the input date when passed as Date', async () => {
			const flowNode = runtime.getFlowNode('format-date');

			const result = await flowNode.formatDate({
				date: new Date('2020-01-08T13:24:40+02:00'),
				format: 'L'
			});

			expect(result.callCount).to.equal(1);
			expect(result.output).to.equal('next');
			expect(result.args).to.deep.equal([null, '01/08/2020']);
			expect(result.context).to.deep.equal({
				date: '01/08/2020'
			});
		});

		/**
		 * Check some of the available formatting that Moment.js provides.
		 */
		it('should format date as expected with different formats', async () => {
			const flowNode = runtime.getFlowNode('format-date');

			const testDate = '2020-01-08T13:24:40+02:00';
			const testData = [
				{
					format: 'MMMM Do YYYY, h:mm:ss a',
					formatted: 'January 8th 2020, 1:24:40 pm'
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
				const result = await flowNode.formatDate({
					date: testDate,
					format: test.format
				});

				expect(result.callCount).to.equal(1);
				expect(result.output).to.equal('next');
				expect(result.args).to.deep.equal([null, test.formatted]);
				expect(result.context).to.deep.equal({
					date: test.formatted
				});
			}
		});

		/**
		 * There is no sanity check on the formats in Moment.js, so an invalid format could be
	     * specified. As this is simply a wrapper node, we expect this to be allowed.
		 */
		it('should NOT fail to format date with invalid input format', async () => {
			const flowNode = runtime.getFlowNode('format-date');

			const invalidFormat = 'clearly-not-a-format';
			const result = await flowNode.formatDate({
				date: '2020-01-08T13:24:40+02:00',
				format: invalidFormat
			});

			expect(result.output).to.equal('next');
			// Moments does some transformation based on its defined aliases. The result here is
			const momentResult = 'c1/8/20203pmr1/8/2020y-not-pm-for24pmt';
			expect(result.args).to.deep.equal([null, momentResult]);
			expect(result.context).to.deep.equal({
				date: momentResult
			});
		});

		it('should fail to format an invalid input date', async () => {
			const flowNode = runtime.getFlowNode('format-date');

			const invalidDate = 'clearly-not-a-date';
			const result = await flowNode.formatDate({
				date: invalidDate,
				format: 'L'
			});

			const expectedMessage = `Invalid date: '${invalidDate}`;
			expect(result.args[1]).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
			expect(result.context).to.be.an('Object');
			expect(result.context.error).instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});
	});
});
