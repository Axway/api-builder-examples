const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-sdk');

const getPlugin = require('./index');

function getLogger () {
	const logger = {
		debug: () => {},
		trace: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		fatal: () => {}
	};
	logger.scope = () => logger;
	return logger;
}

describe('flow-node format-date', () => {
	let runtime;
	before(async () => {
		const plugin = await getPlugin({}, {
			logger: getLogger()
		});
		runtime = new MockRuntime(plugin);
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(runtime).to.exist;
			// Ensure there's a flow-node and schemas created for each OAS document
			expect(Object.keys(runtime.plugin.flownodes)).to.have.length(1);
			expect(runtime.plugin.schema).to.have.length(6);
			const flownode = runtime.getFlowNode('petstore');
			expect(flownode).to.be.a('object');

			// Ensure the flow-node matches the OAS document
			expect(flownode.name).to.equal('Swagger Petstore');
			expect(flownode.description).to.equal('This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.');
			expect(flownode.icon).to.be.a('string');
			expect(Object.keys(flownode.methods)).to.deep.equal([
				'uploadFile',
				'addPet',
				'updatePet',
				'findPetsByStatus',
				'findPetsByTags',
				'getPetById',
				'updatePetWithForm',
				'deletePet',
				'placeOrder',
				'getOrderById',
				'deleteOrder',
				'getInventory',
				'createUsersWithArrayInput',
				'createUsersWithListInput',
				'getUserByName',
				'updateUser',
				'deleteUser',
				'loginUser',
				'logoutUser',
				'createUser'
			]);
		});

		// It is vital to ensure that the generated node flow-nodes are valid
		// for use in API Builder. Your unit tests should always include this
		// validation to avoid potential issues when API Builder loads your
		// node.
		it('should define valid flow-nodes', () => {
			expect(runtime.validate()).to.not.throw;
		});
	});

});
