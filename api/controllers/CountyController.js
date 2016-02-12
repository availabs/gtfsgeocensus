/**
 * CountyController
 *
 * @description :: Server-side logic for managing Counties
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

	var helper   = require('./helper');
	module.exports = {

		find:function(req,res){
			if(true){
				var sid= req.param('sid');
				if(!sid){
					res.send('Must Specify State',400);
				}
				queryCounty(sid,County,req,res);
			}else{
				res.send({err:'UNAUTHORIZED ACCESS'},503);
			}
		},

		findOne:function(req,res){
			if(true){
				var sid = req.param('sid');
				var cid = req.param('cid');
				if(cid.length === 0 || sid.length === 0){
					return res.send('Must Specify Id\'s',400);
				}
				if(cid.length !== 3){
					return res.send('Invalid County Id',400);
				}
				if(sid.length !== 2){
					return res.send('Invalid State Id',400);
				}
				queryCounty(sid+cid,County,req,res);
			}else{
				res.send({err:'UNAUTHORIZED ACCESS'},503);
			}
		},

		findUSCounties : function(req,res){
			if(true){
				queryCountry('',County,req,res);
			}
		},
		findRouteCounties : function(req,res){
			if(true){
				var agency=req.param('agency');
				var geoids;
				if(req.body && req.body.forEach){
					geoids = req.body;
				}
				Agencies.findOne(agency).exec(function(err,agency){
					var route = req.param('rid');
					queryRouteCounty(agency.tablename,route,geoids,County,req,res);
				});
			}else{
				res.send({err:'UNAUTHORIZED ACCESS'},503);
			}
		},
		getCounties : function(req,res){
			if(true){
				var cid = req.param('cid');
				queryCounties(cid,County,req,res);
			}else{
				res.send({err:'UNAUTHORIZED ACCESS'},503);
			}
		},

	};

        function respond(res,data){
	    try{
		var json = helper.convertToTopo(data.rows);
		res.send(json);
	    }catch(e){
		return res.send(e,500);
	    }
	    
	}
	function queryCounties(cid,model,req,res){
		console.log('querying tracts',cid);
		model.query(helper.query.countiesQuery(cid),{},function(err,data){
			if(err){
				console.log(err);
				res.send({err:'Error Retrieving Tract Info'},500);
			}else{
			    respond(res,data);
			}
		});
	}

	function queryRouteCounty(agency,rid,geoids,model,req,res){
		console.log('Querying Route');
		console.time('Query Route Counties');
		model.query(helper.query.routeCountyQuery(agency,rid,geoids),{},function(err,data){
			if(err){
				console.log(err);
				return res.send({err:'Error Retrieving Route County Info'});
			}
			console.timeEnd('Query Route Counties');
		    
		        respond(res,data);
		});
	}

	function queryCounty(id,model,req,res){
		console.log('made it');
		model.query(helper.query.countyQuery(id),{},function(err,data){
			if(err){
				console.log(err);
				res.send({err:'Error Retrieving County Info'},500);
			}else{
				
				respond(res,data);
			}
		});
	}

	function queryCountry(id,model,req,res){
		console.time('County Query');
		model.query(helper.query.countyQuery(),{},function(err,data){
			console.timeEnd('County Query');
			if(err){
				console.log(err);
				res.send({err:'Error Retrieving County Info'},500);
			}else{
				respond(res,data);
			}
		});
	}
