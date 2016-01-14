var topojson = require('topojson');
module.exports =  {

  convertToTopo : function(data){
  	var geocoll = {type:'FeatureCollection',features:[]};
  	data.forEach(function(geo){
  		var feat = {};
  		feat.type="Feature";feat.geometry=JSON.parse(geo.geom);
  		feat.properties={};
      Object.keys(geo).forEach(function(d){
        if(d !== 'geom')
          feat.properties[d] = feat.properties[d] || geo[d];
      });
  		geocoll.features.push(feat);

  	});
  	var topology = topojson.topology({objs:geocoll},{"property-transform":function(d){return d.properties;}});
  	// var json = {type:'FeatureCollection',features:[],bbox:topology.bbox,transform:topology.transform};

  	// if(topology.objects.objs.geometries.forEach){
  	// 	topology.objects.objs.geometries.forEach(function(d){
  	// 		var f = toTopo(topology,d);
  	// 		json.features.push(f);
  	// 	});
  	// }else{
  	// 	json.features.push(toTopo(topology,topology.objects.states.objs));
  	// }
  	return topology;
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
      // var sql = "SELECT getTopoJSONS('NY') as text;"; sql side json currently 4x slower
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
    routeCountyQuery : function(agency,rid,geoids){
      var excludes = '';
      if(geoids){
        excludes = 'AND geoid NOT IN (\''+geoids.join("','")+'\')';
      }
      var sql = "WITH " +
                "geo AS( "+
                "SELECT geom FROM \""+agency+"\".routes where route_short_name='"+rid+"' "+
                ") "+
                "SELECT ST_AsGeoJSON(the_geom) as geom, geoid,name,aland,awater "+
                "from tl_2013_us_county as ct,geo "+
                "WHERE ST_INTERSECTS(ct.the_geom,ST_setSRID(geo.geom,4326)) "+excludes;
      console.log(sql);
      return sql;
    },
    routeCountyIdQuery : function(agency,rid){
      var where = '';
      if(!rid.forEach){
        where = "WHERE R.route_short_name='"+rid+"'";
      }else{
        where = "WHERE R.route_short_name in ('"+rid.join("','")+"')";
      }
      var sql = "WITH " +
                "geo AS( SELECT S.geom FROM \""+agency+"\".routes as R " +
                      	"JOIN \""+agency+"\".trips as T ON T.route_id=R.route_id "+
                      	"JOIN \""+agency+"\".stop_times as ST ON ST.trip_id=T.trip_id "+
                      	"JOIN \""+agency+"\".stops as S ON S.stop_id = ST.stop_id "+
                      	where+ ' '+
	                       "GROUP BY S.stop_id"+
                ") "+
                "SELECT distinct geoid "+
                "from tl_2013_us_county as ct,geo "+
                "WHERE ST_INTERSECTS(ct.the_geom,ST_setSRID(geo.geom,4326))";
      console.log(sql);
      return sql;
    },
    countyTractQuery : function(countyids,geoids){
      var sql = '';
      var states = {};
      countyids.forEach(function(id){
        var sid = id.substr(0,2);
        states[sid] = states[sid] || [];
        states[sid].push(id);
      });
      var excludes = '';
      if(geoids){
        excludes = 'AND geoid NOT IN (\''+geoids.join("','")+'\')';
      }
      var queryList = Object.keys(states).map(function(id){
        return 'SELECT geoid, name,aland,awater, ST_AsGeoJSON(the_geom) as geom FROM tl_2013_'+id+'_tract ' +
               'WHERE statefp || countyfp IN  (\''+states[id].join("','")+'\') ' + excludes;
      });
      sql = queryList.join(' UNION ');
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
