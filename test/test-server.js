const chai = require('chai');
const chaiHttp = require('chai-http');

const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {DATABASE_URL} = require('../config');
const {BlogPost} = require('../models');
const {closeServer, runServer, app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
	return new Promise((resolve, reject) => {
		console.warn('Deleting database');
		mongoose.connection.dropDatabase()
			.then(result => resolve(result))
			.catch(err => reject(err))
	});
}

function seedBlogPostData() {
	console.info('seeding blog post data');
	const seedData = [];
	for (let i=1; i<=10; i++) {
		seedData.push({
			author: {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName()
			}
			title: faker.lorem.sentence(),
			content: faker.lorem.text()
		});
	}
	return BlogPost.insertMany(seedData);
}

describe('blog posts API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function() {
		return seedBlogPostData();
	});
	afterEach(function() {
		retrn tearDownDb();
	});
	after(function() {
		return closeServer();
	})
});


// BELOW is done by me, ABOVE was from solution

// GET request
it('should return all blog posts', function() {
	let res;
	return chai.request(app)
		.get('/posts')
		.then(function(_res) {
			res = _res;
			res.should.have.status(200);
			res.body.posts.should.have.length.of(count);
		});
});

// POST request
const newPost = generatePost() // where does this come from?

return chai.request(app)
	.post('/posts')
	.send(newPost)
	.then(function(res)){
		res.should.have.status(201);
		res.should.be.json;
		res.body.should.be.a('object');
		res.body.should.include.keys('title', 'content', 'author');
		res.body.title.should.equal(newPost.title);
		res.body.id.should.not.be.null;
		res.body.content.should.equal(newPost.content);
		res.body.author.should.equal(newPost.author);
		return BlogPost.findById(res.body.id);
	})
	.then(function(blogPost)) {
		blogPost.title.should.equal(newPost.title);
		blogPost.content.should.equal(newPost.content);
		blogPost.author.should.equal(newPost.author);
	});

// PUT request
const updateData = {title: 'Updated Title'};

return BlogPost
	.findOne()
	.exec()
	.then(function(blogPost){
		updateData.id = restaurant.id;
		return chai.request(app)
			.put(`/posts/$[blogPost.id]`)
			.send(updateData);
	})
	.then(function(res){
		res.should.have.status(204);

		return BlogPost.findByID(updateData.id).exec();
	})
	.then(function(blogPost) {
		blogPost.title.should.equal(updateData.title);
	});

	// DELETE request
	let blogPost;

	BlogPost
		.findOne()
		.exec()
		.then(function(_blogPost) {
			blogPost = _blogPost;
			return.chai.request(app).delete(`/posts/$[blogPost.id]`);
		})
		.then(function(res){
			res.should.have.status(204);
			return BlogPost.findById(blogPost.id).exec();
		})
		.then(function(_blogPost){
			should.not.exist(_blogPost);
		})




