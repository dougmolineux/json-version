
var docCtrl = require('../controllers/docs');

module.exports = function (app) {

    app.get('/docs', function(req, res, next) {
    	docCtrl.getQ(req.db).then(function(response) {
    		res.send(response);
    	});
    });

    app.post('/docs', function(req, res, next) {
    	console.log("req", req);
    	docCtrl.createQ(req.db, req.body).then(function(response) {
    		console.log("res", res)
    		res.send(response);
    	}).catch(function(err) {
    		console.log("err", err);
    		res.status(500).send(response);
    	});
    });

    app.put('/docs/:id', function(req, res, next) {
    	docCtrl.updateByIdQ(req.db, req.body, req.params.id).then(function(response) {
    		res.send(response);
    	});
    });

    app.get('/docs/:id', function(req, res, next) {
    	console.log("req.params.id", req.params.id)
    	docCtrl.getByIdQ(req.db, req.params.id).then(function(response) {
    		res.send(response);
    	}).catch(function(err) {
    		res.status(500).send({message: err});
    	})
    });

    app.get('/docs/:id/:version', function(req, res, next) {
    	console.log("req.params.id", req.params.id)
    	console.log("req.params.version", req.params.version)
    	docCtrl.getByIdQ(req.db, req.params.id, req.params.version).then(function(response) {
    		res.send(response);
    	}).catch(function(err) {
    		res.status(500).send({message: err});
    	})
    });

    app.delete('/docs/:id', function(req, res, next) {
    	console.log("req.params.id", req.params.id)
    	console.log("req.params.version", req.params.version)
    	docCtrl.deleteByIdQ(req.db, req.params.id).then(function(response) {
    		res.send(response);
    	}).catch(function(err) {
    		res.status(500).send({message: err});
    	})
    });

};