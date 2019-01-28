const request = require('supertest');
const app = require('../../src/app');

describe('Test the authentication path', () => {
	test('Token if valid credentials', async done => {
		request(app)
			.post('/authenticate')
			.send({
				username: 'johny99',
				password: '123123123'
			})
			.expect(res => {
				res.body.token.startsWith("Bearer");
			})
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				done();
			});
	});

	test('Invalid credentials', async done => {
		request(app)
			.post('/authenticate')
			.send({
				username: 'ThereIsNoSuchUser',
				password: '-------'
			})
			.expect(401)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				done();
			});
	});
});
