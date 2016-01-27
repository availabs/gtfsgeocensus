/**
 * TractController
 *
 * @description :: Server-side logic for managing tracts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var helper   = require('./helper');
 module.exports = {

	 find:function(req,res){
		 if(true){
			 var sid= req.param('sid');
			 var cid= req.param('cid');
			 if(!sid || !cid){
				 res.send('Must Specify State and County',400);
			 }
			 queryTract(sid+cid,Tract,req,res);
		 }else{
			 res.send({err:'UNAUTHORIZED ACCESS'},503);
		 }
	 },

	 findOne:function(req,res){
		 if(true){
			 var sid = req.param('sid');
			 var cid = req.param('cid');
			 var tid = req.param('tid');
			 if(cid.length === 0 || sid.length === 0){
				 return res.send('Must Specify Id\'s',400);
			 }
			 if(cid.length !== 3){
				 return res.send('Invalid Tract Id',400);
			 }
			 if(sid.length !== 2){
				 return res.send('Invalid State Id',400);
			 }
			 queryTract(sid+cid+tid,Tract,req,res);
		 }else{
			 res.send({err:'UNAUTHORIZED ACCESS'},503);
		 }
	 },

	 findStateTracts:function(req,res){
		 var sid = req.param('sid');
		 if(true){
			 queryStateTract(sid,Tract,req,res);
		 }else{
			 res.send({err:'UNAUTHORIZED ACCESS'},503);
		 }
	 },

   findRouteTracts : function(req,res){
     if(true){
       var geoids;
       var rid = req.param('rid');

       if(req.body && req.body.forEach){
         geoids = req.body;
       }

       var agency = req.param('agency');
       console.log('The GeoIds',geoids);
       Agencies.findOne(agency).exec(function(err,agency){
         queryRouteTract(agency.tablename,rid,geoids,Tract,req,res);
       });
     }else{
       res.send({err:'UNAUTHORIZED ACCESS'},503);
     }
   },

   findCountyTracts : function(req,res){
     if(true){
       var cid = req.param('cid');
       queryCountyTracts(cid,Tract,req,res);
     }else{
       res.send({err:'UAUTHORIZED ACCESS'},503);
     }
   },

   getTracts : function(req,res){
     if(true){
       var tid = req.param('tid');
       queryTracts(tid,Tract,req,res);
     }else{
       res.send({err:'UNAUTHORIZED ACCESS'},503);
     }
   },
 };

 function queryCountyTracts(cid,model,req,res){
   console.log('queryingCountyTracts');
    console.time('queryingCountyTracts');
    model.query(helper.query.countyTractQuery(cid),{},function(err,data){
      if(err){
        console.log(err);
        res.send({err:'Error Retreiving Tract Info'},500);
      }else{
        console.timeEnd('queryingCountyTracts');
        var json = helper.convertToTopo(data.rows);
        res.send(json);
      }
    });
 }

 function queryTracts(tid,model,req,res){
   console.log('querying tracts',tid);
   model.query(helper.query.muliStateTractsQuery(tid),{},function(err,data){
     if(err){
       console.log(err);
       res.send({err:'Error Retrieving Tract Info'},500);
     }else{
       var json = helper.convertToTopo(data.rows);
       res.send(json);
     }
   });
 }


 function queryRouteTract(agency,rid,geoids,model,req,res){
   console.log('queryingRouteTract');
   console.time('queryingRouteTract');
   model.query(helper.query.routeCountyIdQuery(agency,rid),{},function(err,data){
     if(err){
       console.log(err);
       res.send({err:'Error Retrieving Tract Info'},500);
     }else{
       console.timeEnd('queryingRouteTract');
       var countyIds = data.rows.map(function(row){
         return row.geoid;
       });
       console.time('countyTracts');
       model.query(helper.query.countyTractQuery(countyIds,geoids),{},function(err,data){
         if(err){
           console.log(err);
           res.send({err:'Error Retrieving Tract Info'},500);
         }else{
          console.timeEnd('countyTracts');
          var json = helper.convertToTopo(data.rows);
          res.send(json);
         }
       });
     }
   });
 }

 function queryTract(id,model,req,res){
	 console.log('made it');
	 model.query(helper.query.tractQuery(id),{},function(err,data){
		 if(err){
			 console.log(err);
			 res.send({err:'Error Retrieving Tract Info'},500);
		 }else{
			 var json = helper.convertToTopo(data.rows);
			 res.send(json);
		 }
	 });
 }

 function queryStateTract(id,model,req,res){
	 if(id.length === 2){
		 console.time('Query');
		 model.query(helper.query.tractQuery(id),{},function(err,data){
			 console.timeEnd('Query');
			 if(err){
				 console.log(err);
				 res.send({err:'Error Retrieving Tract Info'},500);
			 }else{
				 console.time('conversion');
				 var json = helper.convertToTopo(data.rows);
				 console.timeEnd('conversion');
				 res.send(json);
			 }
		 });
	 }
 }
