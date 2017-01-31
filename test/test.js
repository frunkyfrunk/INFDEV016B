
    var fs=require('fs');
    
    describe('Check if Script files are in /js folder', function() {
  describe('Check crafty.js', function() {
    it('Should find crafty.js', function(done) {
      fs.exists('./js/crafty.js',function(exists){
    if(exists){
	    done();
    }
});
    });
  });
  describe('Check game.js', function() {
    it('Should find game.js', function(done) {
      fs.exists('./js/game.js',function(exists){
    if(exists){
	    done();
    }
});
    });
  });
  describe('Check crafty-min.js', function() {
    it('Should find crafty-min.js', function(done) {
      fs.exists('./js/crafty-min.js',function(exists){
    if(exists){
	    done();
    }
});
    });
  });
});


     //  require('../js/crafty.js');

   // require('../js/game.js');
