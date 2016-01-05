var updateCenter = {
    loaded : false,
    featuredLoaded : false,
    postLoaded : false
};

// This is the jsonp callback from the wiki, which will trigger a window event
// letting everyone know the data has been returned...
// it will also trigger the cleanData method to make sure the data is the
// correct format for the grid...
updateCenter.post = function(data) {
    console.log('fetched');
    updateCenter.pluginsObj = data.plugins;
    updateCenter.postLoaded = true;

    if (updateCenter.featuredLoaded) {
	updateCenter.loaded = true;

	var mergedData = updateCenter.margeData();
	var cleanArray = updateCenter.cleanData(mergedData);
	var paginated = updateCenter.paginate(cleanArray, 200, 0);

	$(window).trigger('loadComplete', updateCenter);
    }

    return updateCenter;
};

// This guy fetches a static representation of the featured plugin data Daniel
// and tosses it into the [featuredPlugin] attribute...
// provided....
updateCenter.featured = function(data) {
    updateCenter.featuredLoaded = true;
    updateCenter.featuredPlugins = data;

    if (updateCenter.postLoaded) {
	updateCenter.loaded = true;

	var mergedData = updateCenter.margeData();
	updateCenter.cleanData(mergedData);

	$(window).trigger('loadComplete', updateCenter);

    }

    return data
}

// This guy folds in the category information specified by Daniel [featureData]
// merges it into the data from the update center [sourceData], adding feature
// and category metadata...
// it returns the augmented sourceData as a plain object, same as it found it.
updateCenter.margeData = function() {

    var data = this;
    var featureData = $.extend({}, data.featuredPlugins.groups);
    var sourceData = $.extend({}, data.pluginsObj);

    $.each(featureData, function(i, group) {
	$.each(group.items, function(j, row) {
	    var pluginName = row.attrs.id;
	    var pluginSource = sourceData[pluginName]
	    var pluginDetails = $.extend({}, pluginSource);
	    var newPlugin = $.extend(featureData[i].items[j].attrs, row.attrs,
		    pluginDetails, {
			scope : 'featured',
			category : group.title
		    });

	    pluginSource.scope = 'featured';
	    pluginSource.category = group.title;

	});
    });

    return sourceData;
}

// This guy makes sure that the data being fed to the grid matches its api....
// It will return an array of grouped plugins...
updateCenter.cleanData = function(data) {
    function _cleanObj(obj) {
	// trim Jenkins and plugin out of the display name...
	obj.title = $.trim(obj.title.replace('Jenkins ', '').replace('Plugin',
		'').replace('Plug-in', '').replace('plugin', '').replace(
		'plug-in', ''));

	// give the item an id attribute...
	obj.id = obj.name;

	// convert plugin attributes to array of attributes...
	obj.attrs = $.map(obj, function(val, key) {
	    return {
		id : key,
		val : val
	    }
	});

	return obj;
    }

    var pluginsObj = data.plugins || data;
    var plugins = Object.keys(pluginsObj).map(function(key) {
	return _cleanObj(pluginsObj[key]);
    });
    updateCenter.pluginsObj = pluginsObj;
    updateCenter.plugins = plugins;
    console.log('cleaned');
    return plugins;
};

updateCenter.paginate = function(data, count, index) {

    // make sure the data is an array....
    var arrayData = data;
    if (!$.isArray(data)) {
	arrayData = [];
	$.each(data, function(key, val) {
	    arrayData.push(val);
	});
    }

    var segments = Math.ceil(arrayData.length / count);
    var paginatedData = new Array(segments);
    for (var i = 0; i < segments; i++) {
	paginatedData[i] = [];
	for (var j = 0; j < count && j < arrayData.length; j++) {
	    paginatedData[i].push(arrayData[j]);
	}
    }

    this.all = arrayData;
    this.paginated = paginatedData;

    if (typeof index === 'number') {
	this.plugins = paginatedData[Math.min(index, (segments - 1))];
	return this.plugins;
    }
    return paginatedData;
}
updateCenter.groupData = function(groupingAttr, data) {
    var newData;
    return newData;
}