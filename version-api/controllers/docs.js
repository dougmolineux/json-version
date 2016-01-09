var Q = require("q");
var dbName = "docs";
var ObjectID = require('mongodb').ObjectID;
var fjp = require("fast-json-patch");

function getQ(db) {
	var collection = db.collection(dbName);
	var deferred = Q.defer();
	collection.find({}).toArray(function(err, docs) {
		console.log("Found the following records");
		console.dir(docs);
		docs.map(function(doc) {
			doc = applyRevs(doc)
		})
		deferred.resolve({ docsFound: docs });
	}); 
	return deferred.promise;     
}

function getByIdQ(db, id, version) {
	var collection = db.collection(dbName);
	var deferred = Q.defer();
	collection.find({ _id: ObjectID(id) }).toArray(function(err, docs) {
		if(!docs.length) {
			return deferred.reject({ message: "No docs found with that id"});
		}
		console.log("Found the following records");
		var revisedDoc = applyRevs(docs[0], version);
		console.dir(revisedDoc);
		deferred.resolve(revisedDoc);
	}); 
	return deferred.promise;    
}

function applyRevs(doc, version) {
	if(version != "original") {
		doc.revisions.forEach(function(rev, idx) {
			if(!version || (version && idx <= version)) {
				fjp.apply(doc.doc, rev)
			}
		})
	}
	return doc;
}

function createQ(db, doc) {
	var collection = db.collection(dbName);
	var deferred = Q.defer();
	if(!doc) {
		deferred.reject({ err: "Document isn't valid" });
	} else {
		collection.insert({ doc: doc, revisions: [] }, function(err, result) {
			console.log("Insert attempted", result);
			deferred.resolve({ result: result });
		}); 
	}
	return deferred.promise; 
}

function updateByIdQ(db, updateDoc, id) {
	var collection = db.collection(dbName);
	var deferred = Q.defer();
	collection.find({ _id: ObjectID(id) }).toArray(function(err, docs) {
		console.log("Found the following records");
		console.dir(docs);
		console.log("updateDoc", updateDoc); 

		var revisedDoc = applyRevs(docs[0]);
		var diffs = fjp.compare(revisedDoc.doc, updateDoc);

		console.log("diffs", diffs);

		collection.update({ 
			_id: ObjectID(id)
		}, {
			$push: {
				revisions: diffs
			}
		}, function(err, results) {
			deferred.resolve({ updateResults: results });
		});
	}); 
	return deferred.promise;    
}

function deleteByIdQ(db, id) {
	var collection = db.collection(dbName);
	var deferred = Q.defer();
	if(!id) {
		deferred.reject({ err: "No ID provided" });
	} else {
		collection.remove({ _id: ObjectID(id) }, function(err, result) {
			console.log("Delete attempted", result);
			deferred.resolve({ result: result });
		}); 
	}
	return deferred.promise; 
}

module.exports.getQ = getQ;
module.exports.getByIdQ = getByIdQ;
module.exports.createQ = createQ;
module.exports.updateByIdQ = updateByIdQ;
module.exports.deleteByIdQ = deleteByIdQ;

