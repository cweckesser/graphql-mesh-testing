import { GraphQLObjectType } from 'graphql';

import * as schemaLoader from './schema.loader';

describe('Schema loader', () => {
	it('Should be possible to load a schema with components having any overlapping properties merged', async () => {
		// Load schema
		const schema = await schemaLoader.loadSchema('./graphql/schemas/test-schema.json');

		// Obtain Person.data.attributes' properties
		const person = schema.getTypeMap().Person as GraphQLObjectType<any, any>;
		const personData = person.getFields().data;
		const personDataType = personData.type as GraphQLObjectType<any, any>;
		const personDataTypeAttributes = personDataType.getFields().attributes;
		const personDataTypeAttributesType = personDataTypeAttributes.type as GraphQLObjectType<any, any>;
		const personDataTypeAttributesTypeFields = personDataTypeAttributesType.getFields();

		// Check the contact fields
		expect(personDataTypeAttributesTypeFields).toHaveProperty('personal_email');
		expect(personDataTypeAttributesTypeFields).toHaveProperty('personal_phone_number');
		expect(personDataTypeAttributesTypeFields).toHaveProperty('work_email');
		expect(personDataTypeAttributesTypeFields).toHaveProperty('work_phone_number');

		// Check the address fields
		expect(personDataTypeAttributesTypeFields).toHaveProperty('street_name');
		expect(personDataTypeAttributesTypeFields).toHaveProperty('street_number');
		expect(personDataTypeAttributesTypeFields).toHaveProperty('postal_code');
		expect(personDataTypeAttributesTypeFields).toHaveProperty('city');
		expect(personDataTypeAttributesTypeFields).toHaveProperty('state');
		expect(personDataTypeAttributesTypeFields).toHaveProperty('country');
	});
});
