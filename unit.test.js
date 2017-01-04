var request = require('superagent');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

var User = require('../models/user');


describe('playGame', function(){

	var baseUrl = 'http://0.0.0.0:3000';

	describe('when get /hitman', function(){
		it('should show button', function(done){
			request.get(baseUrl + '/hitman').end(function assert(err, res){

				expect(err).to.not.be.ok;
				expect(res).to.have.property('status', 200);
				expect(res.text).to.include('Huurmoordenaar');
				expect(res.text).to.include('  <form action="/hitman" method="POST" id="addMoney">');

				done();
			});
		});
	});

});

describe('rewardPlayer', function(){

var baseUrl = 'http://0.0.0.0:3000';

	describe('when post /hitman', function(){
		it('should update money', function(done){
			this.timeout(0);

			request.post(baseUrl + '/hitman').end(function assert(err, res){

				expect(err).to.not.be.ok;
				expect(res).to.have.property('status', 200);
				expect(User.money).to.equal(1149);

				done();
			});

		});
	});
});

