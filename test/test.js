var request = require('supertest');
var superagent = require('superagent');
var chai = require('chai');
var mongoose = require('mongoose');
var expect = chai.expect;
var should = global.Should = require('chai').Should();
var assert = require('chai').assert;

var User = require('../models/user');
var server = require('../app');
var api = request('http://localhost:3000');


describe('Database Tests', function() {

	//Variables
	var testUser = null;  
	const db = mongoose.connection;

	//Establish connection to test database
	before(function (done){
		mongoose.connect('mongodb://localhost:27017/DEV016B-Test');

		db.on('error', console.error.bind(console, 'connection error'));

		db.once('open', function() {
			console.log('We are connected to test database!');
		});

		//Add test data
		testUser = User({
			username: 'Bob',
			password: 'bob',
			money: 0
		});

		testUser.save(done);
	})


	describe('Test Database', function() {

		it('Adds a new user to database', function(done) {
			//Add test data
			regUser = User({
				username: 'Bobby',
				password: 'bob',
				money: 99
			});

			regUser.save(done);
		});


		it('Retrieves a user by username', function(done) {
			User.find({username: testUser.username}, (err, username) => {
				if(err) {throw err;}
				if(username.length === 0) {throw new Error('No data!');}

				done();
			});
		});
	

		it('Save a user with wrong properties to database', function(done) {
			var wrongSave = User({
				notUserName: 'Not Bob',
				notPassWord: 'Not bob',
				notMoney: 0
			});
			wrongSave.save(err => {
				if(err) { return done();}
				throw new Error('Should generate error!');
			});
		});


		it('Updates a user by username', function(done) {
			//Use timeout of 6 seconds
			this.timeout(6000);

			//Variables
			var oldMoney = testUser.money.toString();
			var newMoney;
			var updateBy = 5;

			//Increment money by 5
			User.findOneAndUpdate({username: testUser.username}, {$inc: {money: updateBy}}, (err, username) => {
				if(err) {throw err;}
				if(username.length === 0) {throw new Error('No data!');}
			});

			//Check money now updated
			User.findOne({username: testUser.username}, (err, username) => {
				if(err) {throw err;}
				if(username.length === 0) {throw new Error('No data!');}

				newMoney = username.money.toString();
			});
	

			//Wait 1 second before running this
			setTimeout(function () {
				//Parse strings to integers
				var n1 = parseInt(oldMoney);
				var n2 = parseInt(newMoney);	

				//Test is passed is oldMoney is lower than newMoney
				expect(n2.valueOf()).to.be.above(n1.valueOf());

				//Invoke done
				done();
		    	}, 1000);

		});

		
		it('POST /hitman/:username', function(done) {
			api.post('/reward/' + testUser.username)
				.end(function(err, res){	
					expect(res.status).to.equal(200);
                    			expect(res.text).to.contain('User has been rewarded!');

					done();
				});
			});

		});


	//After all tests are finished close connection
	after(function(done){
		//Remove data after unit tests
		//Close database connection
		User.remove().exec();
		mongoose.connection.close(done);
	});

});










