var msgo = {
  // TODO: this shouldn't be a global, needs to be attached to the grid...

  makeModel: function(data, config) {
    // each config should contain an 'attrs' array. Each that has the
    // following options:
    //
    // id: logical name for the attribute, also assigned as a css class
    // (defaults to the title)
    // title: the display title for the attribute label or column header
    // (defaults to the id)
    // className: to be applied to each cell in the column
    // path: the reference path to the property data from the json source
    // (assumed to be the id if not specified)
    // labelRenderer: a function that returns the $elem to be displayed in
    // the header
    // renderer: a function that returns the $elem to be displayed in each
    // column or result set
    // sorter: a function that returns the logical value by which the
    // attribute should be sorted or grouped (presumed to be the value)
    // grouper: a function that return the logical value by which the
    // attribute should be grouped (presumed to match the sorter)
    // defaultValue: what goes in cells or properties that are not specified
    // by the data

    // if not specified columns will be infered using the property name as
    // the id.

    var attrs = config.attrs;

    // default renderers...
    // TODO: THis should go somewhere else... likely with the view for the
    // main grid,
    // then I could use the react templates?

    function defaultRenerer(attrObj, itemObj, configAttr, type) {
      var val = attrObj.val;
      var cell = $.extend({}, attrObj, configAttr);
      var row = itemObj;
      var customRenderer = (type) ? configAttr[type + 'Renderer'] : configAttr.renderer;

      function _renderDisplayObject(val) {
        var html = [];
        var showKey = $.isPlainObject(val);
        $.each(val, function(key, value) {
          html
            .push(['<div class="objVal ', showKey, '">']
              .join(''));
          if (showKey)
            html.push(['<span class="key ', key, '">', key,
              '</span>'
            ].join(''));
          if (!$.isArray(value) && !$.isPlainObject(value))
            html.push(['<span class="value item end ', key, '">',
              value, '</span>'
            ].join(''));
          else
            html.push(['<span class="value item', key, '">',
                _renderDisplayObject(value), '</span>'
              ]
              .join(''));
          html.push('</div>');
        });
        return html.join('');
      };

      function _rendergroupObject(val) {
        if ($.isArray(val)) {
          if (val.length === 0)
            return '';
          return val;
        } else if (typeof val === 'object')
          return JSON.stringify(val);
        else
          return val;
      }

      if ($.isFunction(customRenderer))
        return customRenderer(attrObj, itemObj, configAttr);
      if (typeof customRenderer === 'string')
        return customRenderer;

      if (typeof val === 'string')
        return val;
      if (typeof val === 'number')
        return val;
      if ($.isArray(val) || $.isPlainObject(val)) {
        if (type === 'group')
          return _rendergroupObject(val);
        else
          return _renderDisplayObject(val);
      }

    }

    // gimme each group from the data list...
    function loopGroups(i, group) {
      var groupId = group.id;
      var dataItems = group.items;

      // make new group that will contain the modified items...
      newGroup = $.extend({}, group, {
        items: [],
        data: group
      });

      $.each(dataItems, loopItems);
      model.push(newGroup);

    }

    // gimme each item from the data list...
    function loopItems(i, item) {
      var dataId = item.id;
      dataItem = item;
      dataAttrs = item.attrs;

      // make a new item that will contain just the attrs we care about...
      newItem = {
        attrs: new Array(attrs.length),
        data: item
      };

      // start by looking for the requested attributes...
      $.each(attrs, loopConfigAttrs);
      newGroup.items.push(newItem);
    }

    // gimme each item from the config attrs...
    function loopConfigAttrs(i, configAttr) {
      _configAttr = configAttr;
      index = i; // needs to be in context for placement of matching
      // attributes...
      path = configAttr.path;
      configId = configAttr.id;

      // stick the config item in as a place holder
      newItem.attrs[index] = configAttr;

      // now lets match the attributes to those we care about...
      $.each(dataAttrs, loopDataAttrs);
    }

    // gimme each attribute from my data item...
    function loopDataAttrs(i, dataAttr) {
      var id = dataAttr.id;

      // if i don't have a match, get out.
      if (!(path === id || configId === id))
        return;

      // Otherwise make the new modeled object...
      // things to keep:
      // -- value of the object as determined by the path
      // -- raw data value of the matching element
      // -- display value string as determined by the renderer
      // -- sort value string or number as determined by the sortRenderer
      // -- group value string or number as determined byt the
      // groupRenderer
      // -- whether or not this item had this attribute
      // -- whatever else was passed into the config...

      var newObj = $.extend({
        val: null,
        data: null,
        displayVal: null,
        sortVal: null,
        groupVal: null,
        found: true
      }, _configAttr);

      var matcher = path || configId;

      function _applyRenderers(matcher, configId) {
        if (configId === id) {
          newObj.data = dataAttr;
        }
        if (matcher === id) {
          newObj.val = dataAttr;
          newObj.displayVal = defaultRenerer(dataAttr, dataItem,
            _configAttr);
          newObj.groupVal = defaultRenerer(dataAttr, dataItem,
            _configAttr, 'group');
          newObj.sortVal = defaultRenerer(dataAttr, dataItem,
            _configAttr, 'sort');
          newItem.attrs[index] = newObj;
          newItem.data[id] = $.extend({}, newObj);
          return false;
        }
      }

      _applyRenderers(matcher, configId);

    }

    // values I need to share between loops...
    var newGroup = {
      items: []
    };
    var newItem;
    var dataAttrs;
    var dataItem;
    var configId;
    var _configAttr;
    var path;
    var index;

    // determine if I am starting with groups or items or the raw list...
    var groupList = data.groups;
    var itemList = data.items;
    var startList = groupList;
    if (!groupList)
      startList = itemList;
    if (!itemList && !groupList)
      startList = data;

    $.each(startList, loopItems);

    return newGroup;
  },
  paginate: function(data, count, index) {
    debugger;
    // make sure the data is an array....
    return data;
    var arrayData = data;
    var progress = 0;
    var doContinue = true;

    var segments = Math.ceil(arrayData.length / count);
    var paginatedData = [];
    var pages = [];

    // Here starts my groups....
    for (var g = 0; doContinue; g++) {
      var newGroup = $.extend(true, {}, arrayData[g]);
      newGroup.items = [];
      for (var i = 0; i < segments; i++) {
        for (var j = 0; j < count && j < arrayData[g].items.length; j++) {
          var theseItems = arrayData[g].items;
          newGroup.items.push(theseItems[j]);
          progress++;
          doContinue = progress + j < theseItems.length || typeof arrayData.length[g + 1] === 'object';
        }
        pages.push(newGroup);
      }
      paginatedData.push(pages);
    }

    this.paginated = paginatedData;

    if (typeof index === 'number') {
      return paginatedData[Math.min(index, (segments - 1))];
    }
    return paginatedData;
  }

}
