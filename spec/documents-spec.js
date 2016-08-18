const Numbers = require('../server/models/document');

const num = new Numbers();

describe('Test', () => {
	it('adds two numbers', () => {
		expect(num.addNumbers(1, 2)).toBe(3);
	});
});
