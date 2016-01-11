var topojson = require('topojson');
module.exports =  {

  convertToTopo : function(data){
  	var geocoll = {type:'FeatureCollection',features:[]};
  	data.forEach(function(geo){
  		var feat = {};
  		feat.type="Feature";feat.geometry=JSON.parse(geo.geom);
  		feat.properties={region:geo.region,statfp:geo.statefp,stusps:geo.stusps,name:geo.name,aland:geo.aland};
  		geocoll.features.push(feat);

  	});
  	var topology = topojson.topology({objs:geocoll},{"property-transform":function(d){return d.properties;}});
  	var json = {type:'FeatureCollection',features:[],bbox:topology.bbox,transform:topology.transform};

  	if(topology.objects.objs.geometries.forEach){
  		topology.objects.objs.geometries.forEach(function(d){
  			var f = toTopo(topology,d);
  			json.features.push(f);
  		});
  	}else{
  		json.features.push(toTopo(topology,topology.objects.states.objs));
  	}
  	return json;
  },
  query : {
    stateQuery:function(id){
    	var where = '';
    	if(id){
    		if(id.length === 1){
    			id = '0'+id;
    		}
    		where = "WHERE geoid='"+id+"'";
    	}
    	var sql = 'SELECT ST_AsGeoJSON(the_geom) as geom,region,statefp,stusps,name,aland FROM tl_2013_us_state '+where;
    	console.log(sql);
    	return sql;
    },
    countyQuery : function(id){
  		var where = '';
  		if(id){
  			if(id.length === 2){
  				where="WHERE statefp='"+id+"'";
  			}
  			if(id.length === 5){
  				where="WHERE geoid='"+id+"'";
  			}
  		}
  		var sql = 'SELECT ST_AsGeoJSON(the_geom) as geom,statefp,countyfp,namelsad,aland FROM tl_2013_us_county '+where;
  		console.log(sql);
  		return sql;
  	},
    tractQuery : function(id){
   	 var where = '';
   	 if(id){
   		 if(id.length === 2){
   			 where ="WHERE statefp='"+id+"'";
   		 }
   		 if(id.length === 5){
   			 where="WHERE countyfp='"+id.substr(2,5)+"' AND statefp='"+id.substr(0,2)+"'";
   		 }
   		 if(id.length === 11){
   			 where="WHERE geoid='"+id+"'";
   		 }
   	 }
   	 var statefp = id.substr(0,2);
   	 var sql = 'SELECT ST_AsGeoJSON(the_geom) as geom,statefp,tractce,namelsad,aland FROM tl_2013_'+statefp+'_tract '+where;
   	 console.log(sql);
   	 return sql;
   },
  },
};

function toTopo(topology,geom){
  var swap = {type:"GeometryCollection",geometries:[geom]};
  var mesh = topojson.mesh(topology,swap,function(a,b){return true;});
  var f = {type:'Feature',properties:geom.properties,geometry:{type:mesh.type,coordinates:mesh.coordinates}};
  return f;
}
