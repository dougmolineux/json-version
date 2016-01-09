var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/version';
var docCtrl = require('../controllers/docs');


describe("CRUD tests", function() {

	var db, createdId;

	beforeAll(function(done) {
		MongoClient.connect(url, function(err, resultDb) {
			db = resultDb;
			done();
		});
    });

	it("getQ", function(done) {
    	return docCtrl.getQ(db).then(function(response) {
    		expect(typeof response).toBe("object");
    	}).catch(function(err) {
    		console.log("something went wrong", err);
    	}).finally(done)
  	});

  	it("createQ", function(done) {
    	return docCtrl.createQ(db).then(function(response) {
    		expect(typeof response).toBe("object");
    	}).catch(function(err) {
    		console.log("something went wrong", err);
    	}).finally(done)
  	});

  	it("getByIdQ", function(done) {
    	return docCtrl.getQ(getByIdQ, createdId).then(function(response) {
    		expect(typeof response).toBe("object");
    	}).catch(function(err) {
    		console.log("something went wrong", err);
    	}).finally(done)
  	});

});