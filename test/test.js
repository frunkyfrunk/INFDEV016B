/**
 * Created by ruben on 13-12-2016.
 */
var assert = require('assert');
var it = require('mocha').it;
var describe = require('mocha').describe;
var rewire = require('rewire'),
    index = rewire('../routes/index');



describe('higherlower', function () {
    describe('checkWin()', function () {
        it('true when number 1 is lower then number 2 and lower was betted on', function () {
            var checkWin = index.__get__('checkWin');
            assert.equal(true, checkWin(2, 1, 'Lower'));
        });
    });
});