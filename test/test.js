var request = require('supertest');
var chai = require('chai');
var mongoose = require('mongoose');
var expect = chai.expect;
var should = global.Should = require('chai').Should();
var assert = require('chai').assert;

var User = require('../models/user');
var server = require('../app');
var api = request('http://localhost:3000');

var nodeserver = request.agent("http://localhost:3000");

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

		it('Register new user to database', function(done) {
			//Add test data
			var regUser = User({
				username: 'Bobby',
				password: 'bob',
				money: 99
			});

			regUser.save(done);
		});
		
		it('Check if password is valid', function(done) {
			var pass = "bob";
			
			if (testUser != null && testUser.password == pass) {
					done();
				} else {
					throw new Error('Password not valid!');
				}
		});

		
		
		
		it('Retrieves a user by username', function(done) {
			User.find({username: testUser.username}, (err, username) => {
				if(err) {throw err;}
				if(username.length === 0) {throw new Error('No data!');}

				done();
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
			nodeserver
			    .post("/reward/" + testUser.username)
			    .expect(200)
			    .end(function(err,res){
				//Expect HTTP Status to equal 200
				res.status.should.equal(200);
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

    
    var fs=require('fs');
    
    describe('Check if Script files are in /js folder', function() {
  describe('Check crafty.js', function() {
    it('Should find crafty.js', function(done) {
      fs.exists('./public/javascripts/crafty.js',function(exists){
    if(exists){
	    done();
    }
});
    });
  });
  describe('Check game.js', function() {
    it('Should find game.js', function(done) {
      fs.exists('./public/javascripts/game.js',function(exists){
    if(exists){
	    done();
    }
});
    });
  });
  describe('Check bankoverval.js', function() {
    it('Should find bankoverval.js', function(done) {
      fs.exists('./public/javascripts/bankoverval.js',function(exists){
    if(exists){
	    done();
    }
});
    });
  });
        describe('Check dueleren.js', function() {
    it('Should find dueleren.js', function(done) {
      fs.exists('./public/javascripts/dueleren.js',function(exists){
    if(exists){
	    done();
    }
});
    });
  });
        describe('Check higherlower.js', function() {
    it('Should find higherlower.js', function(done) {
      fs.exists('./public/javascripts/higherlower.js',function(exists){
    if(exists){
	    done();
    }
});
    });
  });
         describe('Check hitman.js', function() {
    it('Should find hitman.js', function(done) {
      fs.exists('./public/javascripts/hitman.js',function(exists){
    if(exists){
	    done();
    }
});
    });
  });
});
});










