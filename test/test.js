
    
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











