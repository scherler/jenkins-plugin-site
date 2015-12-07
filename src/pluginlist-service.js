var updateCenter = {loaded:false, featuredLoaded:false, postLoaded:false};

// This is the jsonp callback from the wiki, which will trigger a window event letting everyone know the data has been returned...
// it will also trigger the cleanData method to make sure the data is the correct format for the grid...
updateCenter.post = function(data){
  
  updateCenter.cleanData(data);
  updateCenter.postLoaded = true;
  
  if(updateCenter.featuredLoaded){ 
    updateCenter.loaded = true;
    
    var mergedData = updateCenter.margeData();
    updateCenter.cleanData(mergedData);
    
    $(window).trigger('loadComplete',updateCenter);
  }
  
  return updateCenter;
};

// This guy makes sure that the data being fed to the grid matches its api....
updateCenter.cleanData = function(data){
  function _cleanObj(obj){
    //trim Jenkins and plugin out of the display name...
	obj.title = $.trim(obj.title.replace('Jenkins ','').replace('Plugin','').replace('Plug-in','').replace('plugin','').replace('plug-in',''));
    
    // give the item an id attribute...
    obj.id = obj.name;

    // convert plugin attributes to array of attributes...
    obj.attrs = $.map(obj,function(val,key){
      return {id:key,val:val}
    });
    
    return obj;	
  }
  var pluginsObj = data.plugins || data;
  var plugins = Object.keys(pluginsObj).map(function (key) {
        return _cleanObj(pluginsObj[key]);
  }); 
  updateCenter.pluginsObj = pluginsObj;
  updateCenter.plugins = plugins;
};


// This guy fetches a static representation of the featured plugin data Daniel provided....
updateCenter.featured = function(data){
  updateCenter.featuredLoaded = true;
  updateCenter.featuredPlugins = data;
  
  if(updateCenter.postLoaded){
	 updateCenter.loaded = true;
	 
	 var mergedData = updateCenter.margeData();
     updateCenter.cleanData(mergedData);
    
	 $(window).trigger('loadComplete',updateCenter);
	  
  }
  
  return data
}

// This guy merges the two data sources...
updateCenter.margeData = function(){
  var data = this;
  var newData = $.extend({},data.featuredPlugins.groups);
  var sourceData = $.extend({},data.pluginsObj);
  
  $.each(newData,function(i,group){
    $.each(group.items,function(j,row){
      var pluginName = row.attrs.id;
      var pluginSource = sourceData[pluginName]
      var pluginDetails = $.extend({},pluginSource);
      var newPlugin = $.extend(newData[i].items[j].attrs,row.attrs,pluginDetails,{scope:'featured',category:group.title});
      
      pluginSource.scope = 'featured';
      pluginSource.category = group.title;
      
    });
  });

  return sourceData;
}

updateCenter.groupData = function(groupingAttr,data){
	var newData;
	return newData;
}