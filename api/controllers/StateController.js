/**
 * StateController
 *
 * @description :: Server-side logic for managing states
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var helper   = require('./helper');
module.exports = {

	find:function(req,res){
		if(true){
			queryState('',State,req,res);
		}else{
			res.send({err:'UNAUTHORIZED ACCESS'},503);
		}
	},

	findOne:function(req,res){
		if(true){
			queryState(req.param('id'),State,req,res);
		}else{
			res.send({err:'UNAUTHORIZED ACCESS'},503);
		}
	},

};

function queryState(id,model,req,res){
	console.log('made it');
	model.query(helper.query.stateQuery(id),{},function(err,data){
		if(err){
			console.log(err);
			res.send({err:'Error Retrieving State Info'},500);
		}else{
			var json = helper.convertToTopo(data.rows);
			res.send(json);
		}
	});
}
