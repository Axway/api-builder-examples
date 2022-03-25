const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');

const getPlugin = require('../index');

describe('flow-node petstore', () => {
	let plugin;
	let flowNode;
	before(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		flowNode = plugin.getFlowNode('petstore');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(plugin).to.exist;
			expect(flowNode).to.be.a('object');
			// Ensure the flow-node matches the OAS document
			expect(flowNode.name).to.equal('Swagger Petstore');
			expect(flowNode.description).to.equal('This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.');
			expect(flowNode.icon).to.be.a('string');
			expect(flowNode.getMethods()).to.deep.equal([
				'addPet',
				'createUser',
				'createUsersWithArrayInput',
				'createUsersWithListInput',
				'deleteOrder',
				'deletePet',
				'deleteUser',
				'findPetsByStatus',
				'findPetsByTags',
				'getInventory',
				'getOrderById',
				'getPetById',
				'getUserByName',
				'loginUser',
				'logoutUser',
				'placeOrder',
				'updatePet',
				'updatePetWithForm',	
				'updateUser',			
				'uploadFile'				
			]);
		});

		// It is vital to ensure that the generated node flow-nodes are valid
		// for use in API Builder. Your unit tests should always include this
		// validation to avoid potential issues when API Builder loads your
		// node.
		it('should define valid flow-nodes', () => {
			plugin.validate();
		});
	});

});
