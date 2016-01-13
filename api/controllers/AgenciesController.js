/**
 * AgenciesController
 *
 * @description :: Server-side logic for managing agencies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
		find: function(req,res){
			Agencies.find().exec(function(err,data){
				if(err){
					console.log(err);
					return res.send(err,500);
				}else{
					res.send(data);
				}
			});
		},
};
