const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const actions = require('../src/actions');
const simple = require('simple-mock');

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
			expect(flowNode.description)
				.to.equal('Example flow-node that formats Date. Uses the popular Moment.js library.');
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
							description: 'The date to be formatted. Defaults to current date/time. For more information, see https://momentjs.com/docs/#/parsing/string/',
							required: false,
							initialType: 'string',
							schema: {
								type: 'string',
								title: 'Date',
								example: [ new Date('2020-08-19') ]
							}
						},
						format: {
							description: 'Takes a string of tokens and replaces them with their corresponding values. Defaults to ISO-8601 format. For the full list of supported tokens and examples, see https://momentjs.com/docs/#/parsing/special-formats/',
							required: false,
							initialType: 'string',
							schema: {
								type: 'string',
								title: 'Format',
								default: 'YYYY-MM-DDTHH:mm:ssZ'
							}
						},
						offset: {
							description: 'The desired UTC offset in the format ±[hh]:[mm]',
							required: false,
							initialType: 'string',
							schema: {
								type: 'string',
								title: 'UTC offset',
								pattern: '^[+-][0-1][0-9]:[0-5][0-9]$'
							}
						}
					},
					outputs: {
						next: {
							name: 'Next',
							description: 'The desired formatted date displayed successfully.',
							context: '$.date',
							schema: {
								type: 'string'
							}
						},
						error: {
							name: 'Error',
							description: 'There is an unexpected error on format date encountered.',
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

		afterEach(() => {
			simple.restore();
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

		it('should format a valid date input with a customised input format', async () => {

			const testFormat = '[It\'s the] Do [day of the month] [of] MMMM.';
			const { value, output } = await flowNode.formatDate({
				date: '2020-01-08T13:24:40+02:00',
				format: testFormat
			});

			expect(output).to.equal('next');
			const momentResult = 'It\'s the 8th day of the month of January.';
			expect(value).to.equal(momentResult);
		});

		/**
		 * Momentjs apparently works fine on dates with wrong spelling of the month
		 * provided the month's abbreviated spelling (eg. Jan for January) is matched.
		 * For this test, we expect it to FAIL since the short spelling doesn't match.
		 */
		it('should fail to format a date with month spelt wrongly', async () => {

			const testDate = '2020 8 Jaunary';
			const { value, output } = await flowNode.formatDate({
				date: testDate,
				format: 'lll'
			});

			const expectedMessage = `Invalid date: ${testDate}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		it('should format current date to default format if format and date parameters are disabled', async () => {

			// 2010-10-10T10:10:10Z
			const now = 1286705410000;
			simple.mock(Date, 'now').returnWith(now);

			const { value, output } = await flowNode.formatDate({
				date: undefined,
				format: undefined
			});

			expect(output).to.equal('next');
			expect(value).to.equal('2010-10-10T10:10:10Z');
		});

		it('should format current date to default format if date parameter is disabled and format empty', async () => {

			// 2010-10-10T10:10:10Z
			const now = 1286705410000;
			simple.mock(Date, 'now').returnWith(now);

			const { value, output } = await flowNode.formatDate({
				date: undefined,
				format: ''
			});

			expect(output).to.equal('next');
			expect(value).to.equal('2010-10-10T10:10:10Z');
		});

		it('should format current date per valid format input if date parameter is disabled', async () => {

			// 2010-10-10T10:10:10Z
			const now = 1286705410000;
			simple.mock(Date, 'now').returnWith(now);

			const inputFormat = 'LL';
			const { value, output } = await flowNode.formatDate({
				date: undefined,
				format: 'LL'
			});

			expect(output).to.equal('next');
			expect(value).to.equal('October 10, 2010');
		});

		it('should format a valid date input with the default format if format disabled/empty', async () => {

			const testDate = '2020-10-23';
			const { value, output } = await flowNode.formatDate({
				date: testDate,
				format: ''
			});

			expect(output).to.equal('next');
			expect(value).to.equal('2020-10-22T23:00:00Z');
		});

		it('should apply a valid UTC offset to a valid date input if format is disabled/empty', async () => {

			const testDate = '2020-10-23T21:18:30+01:00';
			const { value, output } = await flowNode.formatDate({
				date: testDate,
				format: '',
				offset: '+03:00'
			});

			expect(output).to.equal('next');
			expect(value).to.equal('2020-10-23T23:18:30+03:00');
		});

		it('should fail to apply an invalid UTC offset to a valid date input if format is disabled/empty', async () => {

			const testDate = '2020-10-23T21:18:30+01:00';
			const offsetVal = '03:00';
			const { value, output } = await flowNode.formatDate({
				date: testDate,
				format: '',
				offset: offsetVal
			});

			const expectedMessage = `Invalid UTC offset: ${offsetVal}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		it('should apply a valid format input on a valid date input ahead of valid offset input', async () => {

			const testDate = '2020-10-23T21:18:30+01:00';
			const offsetVal = '+03:00';
			const { value, output } = await flowNode.formatDate({
				date: testDate,
				format: 'LL',
				offset: offsetVal
			});

			expect(output).to.equal('next');
			expect(value).to.equal('October 23, 2020');
		});

		it('should fail to apply a valid UTC offset to an invalid date if format is disabled/empty', async () => {

			const invalidDate = 'clearly-not-a-date';
			const offsetVal = '+03:00';
			const { value, output } = await flowNode.formatDate({
				date: invalidDate,
				format: '',
				offset: offsetVal
			});

			const expectedMessage = `Invalid date: ${invalidDate}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		it('should fail to format an empty date despite valid format input', async () => {

			const testDate = '';
			const { value, output } = await flowNode.formatDate({
				date: testDate,
				format: 'L'
			});

			const expectedMessage = `Invalid date: ${testDate}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		it('should fail to format an invalid date input despite valid format input', async () => {

			const invalidDate = 'clearly-not-a-date';
			const { value, output } = await flowNode.formatDate({
				date: invalidDate,
				format: 'L'
			});

			const expectedMessage = `Invalid date: ${invalidDate}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		it('should fail to format an invalid date input despite invalid format input', async () => {

			const invalidDate = 'clearly-not-a-date';
			const { value, output } = await flowNode.formatDate({
				date: invalidDate,
				format: 'clearly-not-a-format'
			});

			const expectedMessage = `Invalid date: ${invalidDate}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		/**
		 * There is no sanity check on the formats in Moment.js, so an invalid format could
		 * be specified. As this is simply a wrapper node, we expect this to be allowed.
		 */
		it('should not fail to format a valid date input with invalid format input', async () => {

			const invalidFormat = 'ooooo';
			const { value, output } = await flowNode.formatDate({
				date: '2020-01-08T13:24:40+02:00',
				format: invalidFormat
			});

			expect(output).to.equal('next');
			expect(value).to.equal('ooooo');
		});
	});
});
