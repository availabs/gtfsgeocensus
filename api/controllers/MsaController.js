/**
 * MsaController
 *
 * @description :: Server-side logic for managing msas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var helper = require('./helper');
module.exports = {
    getMsas : function(req,res){

	if(true){
	    var id = req.param('id');
	    if(!id)
		queryMSA('',Msa,req,res);
	    else
		queryMSA(id,Msa,req,res);
	    
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
function queryMSA(id,model,req,res){
    console.time('query');
    model.query(helper.query.msaQuery(id),{},function(err,data){
	console.timeEnd('query');
	if(err){
	    console.log(err);
	}else{
	    console.log('made it')
	    try{
		var json = helper.convertToTopo(data.rows,res);
	    }catch(e){
		return res.send(e,500);
	    }
	    res.send(json);
	}

    });
}
