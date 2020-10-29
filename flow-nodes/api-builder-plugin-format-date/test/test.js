const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');
const actions = require('../src/actions');
const moment = require('moment');

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
							description: 'The date to be formatted example 2020/08/19. Disabling/not entering a date shows current date. See more valid date examples here https://momentjs.com/docs/#/parsing/string/',
							required: false,
							initialType: 'string',
							schema: {
								type: 'string',
								title: 'Date'
							}
						},
						format: {
							description: 'The desired format. Supports all Moment.js formats for dates example YYYY-MM-DDTHH:mm:ssZ. See more valid format examples https://momentjs.com/docs/#/parsing/special-formats/',
							required: false,
							initialType: 'string',
							schema: {
								type: 'string',
								title: 'Format'
							}
						},
						offset: {
							description: 'The desired time zone UTC offset. Supports Moment.js UTC offset format for only strings. Example +08:45, -02:00. See https://momentjscom.readthedocs.io/en/latest/moment/03-manipulating/09-utc-offset/',
							required: false,
							initialType: 'string',
							schema: {
								type: 'string',
								title: 'Time zone UTC offset'
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
		 * Check some of the available formats that Moment.js provides.
		 */
		it('should format date as expected with different formats', async () => {

			const testDate = '2020-01-08T13:24:40+02:00';
			const testData = [
				{
					format: 'MMMM D YYYY, h:mm:ss a',
					formatted: 'January 8 2020, 11:24:40 am'
				},
				{
					format: 'D MMMM YYYY, h:mm:ss a',
					formatted: '8 January 2020, 11:24:40 am'
				},
				{
					format: 'YYYY D MMMM, h:mm:ss a',
					formatted: '2020 8 January, 11:24:40 am'
				},
				{
					format: 'dddd MMMM D YYYY, h:mm:ss a',
					formatted: 'Wednesday January 8 2020, 11:24:40 am'
				},
				{
					format: 'YYYY-MM-DDTHH:mm',
					formatted: '2020-01-08T11:24'
				},
				{
					format: 'YYYY-MM-DDTHH:mm:ss',
					formatted: '2020-01-08T11:24:40'
				},
				{
					format: 'YYYY-MM-DDTHH:mm:ss.SSS',
					formatted: '2020-01-08T11:24:40.000'
				},
				{
					format: 'YYYY-MM-DDTHH:mm:ssZ',
					formatted: '2020-01-08T11:24:40+00:00'
				},

				{
					format: 'MMMM Do YYYY, h:mm:ss a',
					formatted: 'January 8th 2020, 11:24:40 am'
				},
				{
					format: 'Do MMMM YYYY, h:mm:ss a',
					formatted: '8th January 2020, 11:24:40 am'
				},
				{
					format: 'YYYY Do MMMM, h:mm:ss a',
					formatted: '2020 8th January, 11:24:40 am'
				},
				{
					format: 'dddd MMMM Do YYYY, h:mm:ss a',
					formatted: 'Wednesday January 8th 2020, 11:24:40 am'
				},
				{
					format: 'MMMM dddd Do YYYY, h:mm:ss a',
					formatted: 'January Wednesday 8th 2020, 11:24:40 am'
				},
				{
					format: 'MMMM Do YYYY',
					formatted: 'January 8th 2020'
				},
				{
					format: 'MMMM YYYY Do',
					formatted: 'January 2020 8th'
				},
				{
					format: 'Do MMMM YYYY',
					formatted: '8th January 2020'
				},
				{
					format: 'Do YYYY MMMM',
					formatted: '8th 2020 January'
				},
				{
					format: 'YYYY-MMMM-Do',
					formatted: '2020-January-8th'
				},
				{
					format: 'YYYY/MMMM/Do',
					formatted: '2020/January/8th'
				},

				{
					format: 'GGGG-[W]WW',
					formatted: '2020-W02'
				},
				{
					format: 'DD MMMM',
					formatted: '08 January'
				},
				{
					format: 'MMMM YYYY',
					formatted: 'January 2020'
				},
				{
					format: 'YYYY-MM',
					formatted: '2020-01'
				},
				{
					format: 'YYYY-MM-DD',
					formatted: '2020-01-08'
				},
				{
					format: 'MM/DD/YYYY',
					formatted: '01/08/2020'
				},
				{
					format: 'MMMM-YYYY-DD',
					formatted: 'January-2020-08'
				},
				{
					format: 'L',
					formatted: '01/08/2020'
				},
				{
					format: 'LL',
					formatted: 'January 8, 2020'
				},
				{
					format: 'LLL',
					formatted: 'January 8, 2020 11:24 AM'
				},
				{
					format: 'LLLL',
					formatted: 'Wednesday, January 8, 2020 11:24 AM'
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
		 * Check some of the available date and format strings that Moment.js provides.
		 */
		it('should format different valid dates as expected with different formats', async () => {

			const testData = [
				{
					date: 'January 8 2020, 11:24:40 am',
					format: 'YYYY-MM-DDTHH:mm:ssZ',
					formatted: '2020-01-08T11:24:40+00:00'
				},
				{
					date: '20200108',
					format: 'YYYY-MM-DD',
					formatted: '2020-01-08'
				},
				{
					date: '2020/01/08',
					format: 'YYYY Do MMMM, h:mm:ss a',
					formatted: '2020 8th January, 12:00:00 am'
				},
				{
					date: '2020 8th January',
					format: 'll',
					formatted: 'Jan 8, 2020'
				},
				{
					date: 'Mar 2020 11th',
					format: 'GGGG-[W]WW',
					formatted: '2020-W11'
				},
				{
					date: 'January-2020-08',
					format: 'dddd MMMM Do YYYY',
					formatted: 'Wednesday January 8th 2020'
				}
			];
			for (const test of testData) {
				const { value, output } = await flowNode.formatDate({
					date: test.date,
					format: test.format
				});
				expect(output).to.equal('next');
				expect(value).to.equal(test.formatted);
			}
		});

		/**
	 	 * Momentjs apparently works fine on dates with wrong spelling of the month
		 * provided the month's abbreviated spelling (eg. Dec for December) is matched.
		 * For these tests, we expect it to pass since the short or full version spelling matches.
		 */
		it('should NOT FAIL to format these WRONGLY SPELT MONTHS in dates of this formats', async () => {

			const testData = [
				{
					date: '2020 8th Januarydfmjfhjkgh',
					format: 'lll',
					formatted: 'Jan 8, 2020 12:00 AM'
				},
				{
					date: '2020 8th Januadfmjfhjkgh',
					format: 'l',
					formatted: '1/8/2020'
				},
				{
					date: '2020 8 Jandfmjfhjkgh',
					format: 'llll',
					formatted: 'Wed, Jan 8, 2020 12:00 AM'
				},
				{
					date: 'Octghgkjhg/09/2020',
					format: 'dddd MMMM Do YYYY',
					formatted: 'Friday October 9th 2020'
				},

				{
					date: 'Octoberghgkjhg/09/2020',
					format: 'MMMM D YYYY',
					formatted: 'October 9 2020'
				}
			];
			for (const test of testData) {
				const { value, output } = await flowNode.formatDate({
					date: test.date,
					format: test.format
				});
				expect(output).to.equal('next');
				expect(value).to.equal(test.formatted);
			}
		});


		/**
		 * Momentjs apparently works fine on dates with wrong spelling of the month
		 * provided the month's abbreviated spelling (eg. Dec for December) is matched.
		 * For these tests, we expect it to FAIL since the short or full version spellings do not match.
		 */
		it('should FAIL to format these WRONGLY SPELT MONTHS in dates of this formats', async () => {

			const testData = [
				{
					date: '2020 8th Jaunary',
					format: 'lll'
				},
				{
					date: '2020 8 Jadfmjfhjkgh',
					format: 'llll'
				},
				{
					date: 'Ocghgkjhg/09/2020',
					format: 'dddd MMMM Do YYYY'
				},
				{
					date: 'Oktober/09/2020',
					format: 'MMMM D YYYY'
				}
			];
			for (const test of testData) {
				const { value, output } = await flowNode.formatDate({
					date: test.date,
					format: test.format
				});

				let expectedMessage = `Invalid Date: '${test.date}`;
				expect(value).to.be.instanceOf(Error)
					.and.to.have.property('message', expectedMessage);
			}
		});

		it('should format current date in "YYYY-MM-DDTHH:mm:ssZ" format if format and date parameters are disabled/empty', async () => {

			const defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
			const { value, output } = await flowNode.formatDate({
				date: '',
				format: ''
			});

			expect(output).to.equal('next');
			expect(value).to.equal(moment().format(defaultFormat));
		});

		it('should format current date per valid format input if date parameter is disabled/empty', async () => {

			const inputFormat = 'LL';
			const { value, output } = await flowNode.formatDate({
				date: '',
				format: 'LL'
			});

			expect(output).to.equal('next');
			expect(value).to.equal(moment().format(inputFormat));
		});

		it('should format a valid date input successfully with default momentjs format if format disabled/empty', async () => {

			const testDate = '2020-10-23';
			const { value, output } = await flowNode.formatDate({
				date: testDate,
				format: ''
			});

			expect(output).to.equal('next');
			expect(value).to.equal('2020-10-23T00:00:00+01:00');
		});

		it('should apply successfully a valid UTC offset to a valid date input if format is disabled/empty', async () => {

			const testDate = '2020-10-23T21:18:30+01:00';
			const { value, output } = await flowNode.formatDate({
				date: testDate,
				format: '',
				offset: '+03:00'
			});

			expect(output).to.equal('next');
			expect(value).to.equal('2020-10-23T23:18:30+03:00');
		});

		it('should NOT apply an invalid UTC offset to a valid date input if format is disabled/empty', async () => {

			const testDate = '2020-10-23T21:18:30+01:00';
			const { value, output } = await flowNode.formatDate({
				date: testDate,
				format: '',
				offset: '03:00'
			});

			expect(output).to.equal('next');
			expect(value).to.equal(testDate);
		});

		it('should apply successfully a valid UTC offset to current date if date and format are disabled/empty', async () => {

			const offsetVal = '+03:00';
			const { value, output } = await flowNode.formatDate({
				date: '',
				format: '',
				offset: offsetVal
			});

			expect(output).to.equal('next');
			expect(value).to.equal(moment().utcOffset(offsetVal).format());
		});

		it('should apply successfully a valid format on a valid date ahead of valid offset if all parameters enabled and valid', async () => {

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

		it('should not apply a valid utc offset to an invalid date', async () => {

			const invalidDate = 'clearly-not-a-date';
			const offsetVal = '+03:00';
			const { value, output } = await flowNode.formatDate({
				date: invalidDate,
				format: '',
				offset: offsetVal
			});

			const expectedMessage = `Invalid Date: '${invalidDate}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		it('should fail to format an invalid date input despite valid format input', async () => {

			const invalidDate = 'clearly-not-a-date';
			const { value, output } = await flowNode.formatDate({
				date: invalidDate,
				format: 'L'
			});

			const expectedMessage = `Invalid Date: '${invalidDate}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		it('should fail to format an invalid date input despite invalid format input', async () => {

			const invalidDate = 'clearly-not-a-date';
			const { value, output } = await flowNode.formatDate({
				date: invalidDate,
				format: 'clearly-not-a-format'
			});

			const expectedMessage = `Invalid Date: '${invalidDate}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		it('should fail to format a valid date input with invalid input format', async () => {

			const invalidFormat = 'clearly-not-a-format';
			const { value, output } = await flowNode.formatDate({
				date: '2020-10-23T21:18:30+01:00',
				format: invalidFormat
			});

			const expectedMessage = `Invalid Format: '${invalidFormat}`;
			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', expectedMessage);
		});

		/**
		 * Expect these VALID formats (which when applied to a valid date returns a specific
		 * portion of the valid date input eg. day or month), to turn out as INVALID format
		 * since applying moment on the resulting formatted date output yields an invalid date
		 */
		 it('should FAIL to format a valid date input with these valid formats', async () => {

			 const testDate = '2020-10-23';
			 const testData = [
				 { format: 'MMM' },
				 { format: 'MMMM' },
				 { format: 'dd' },
				 { format: 'ddd' },
				 { format: 'dddd' },
				 { format: 'YYYY [escaped] YYYY' }
			 ];
			 for (const test of testData) {
				 const { value, output } = await flowNode.formatDate({
					 date: testDate,
					 format: test.format
				 });
				 // expect(output).to.equal('next');
				 // expect(value).to.equal(test.formatted);
				 const expectedMessage = `Invalid Format: '${test.format}`;
				 expect(value).to.be.instanceOf(Error)
						.and.to.have.property('message', expectedMessage);
			 }
		 });
	});
});
