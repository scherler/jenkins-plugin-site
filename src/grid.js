var GridBox = React.createClass({
  whoisthis:'GridBox',
  dataValue:null,
  attachConfiguration:function(data,config){
	var dataValue = msgo.makeModel(data,config);
	return dataValue;
  },
  setAttributes:function(){},
  onDataChange:function(newData){
      console.log('-----------------------');
      console.log(newData);
      this.replaceState({
	  gridData: newData
      });
  },
  getInitialState:function(){
      var p = this.props;
      return {gridData:this.attachConfiguration(p.data,p.config)};
  },
  render: function() {
      var p = this.props;
      var s = this.state;
      console.log(p.data);
      console.log(s.gridData);
    return (
      <div className="bootstrap3 cjp-grid-box smart-grid grid">
        <GridToolbar config={p.config} data={s.gridData} dataChange={this.onDataChange} />
        <GridFrame frameData={s.gridData} />
      </div>
    );
  }
});

var GridToolbar = React.createClass({
  setAttributes:function(){},
  groupHandler:function(val,key,configAttr){
	  configAttr = configAttr || {};
	  var p = this.props;
	  var altVal = configAttr.path;
	  var gridData = p.data;
	  var flatGrid = gridData.items;
	  var newData = {groups:[]};
	  var groupMap = [];
	  function _groupFlatGrid(i,item){
		var attr = item.data[val] || item.data[altVal] || {};	
	    var groupVal = attr.groupVal;
	    var newGroup;
	    
	    function _addGroup(i, val){
	    	var newVal = val;
	    	if(typeof val === 'object') newVal = JSON.stringify(val);
	    	var mapIndex = groupMap.indexOf(newVal);
	    	
	    	if(mapIndex === -1){
	    	    var newAttr = $.extend({},attr,{groupVal:newVal})
        	    newGroup = $.extend({items:[]},newAttr);
            	    groupMap.push(newVal);
            	    newGroup.items.push(item);
            	    newData.groups.push(newGroup);
	    	}else{
        	    newData.groups[mapIndex].items.push(item);
        	}	    	
	    }

	    if($.isArray(groupVal)){
	    	$.each(groupVal,_addGroup);
	    }
	    else{
	    	_addGroup(0,groupVal);
	    }
	    
	  }
	  
	  // check to see if we are in a grouped state already....
	  if (gridData.items){
		  $.each(flatGrid,_groupFlatGrid);
	  }
	  newData.isGrouped = true;
	  p.dataChange(newData);
  },
  render: function() {
	var p = this.props;
	return (
      <div className="toolbar-box">
      <div className="toolbar">
      	<div className="hidden table-hovers"></div>
      	<nav className="navbar navbar-light bg-faded attached">
      	  <button className="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#exCollapsingNavbar2">
            &#9776;
          </button>
      	  <div className="collapse navbar-toggleable-xs">
  			<ul className="nav navbar-nav navbar-right __pulldowns__">
  				<li className="nav-item">
  					<Dropdown k="group" attrs={p.config.attrs} data={p.data} clickHandler={this.groupHandler} />
  				</li>
  				<li className="nav-item">
  					
  				</li>
  			</ul>
      	  </div>
      	</nav>
      </div>
      </div>
    );
  }
});


var GridFrame = React.createClass({
  setAttributes:function(){},
  getInitialState:function(){
      return {frameData:this.props.frameData}
  },
  render: function() {
      
	var data = this.props.frameData;
	console.log('frame');
	console.log(data);
	var groups = [];
	if(data.isGrouped){
		groups = data.groups;
	}else{
		groups.push({items:data.items});
	}
	
    return (
      <div className="grid-frame">
      	<ol className="grid-inner">
      	{groups.map(function(group,i){
      		
      		return (<GridGroup groupData={group} key={i} />);
        
      	})}
      	</ol>
      </div>
    );
  }
});

var GridGroup = React.createClass({
  setAttributes:function(){},
  getInitialState:function(){
      return {data:this.props.data}
  },  
  render: function() {
	var data = this.props.groupData;
	var items = data.items;
	var itemList = (items)? 
	  items.map(function(item, i){
		return (<GridItem data={item} key={i} />)
	  }):
		  [];
    return (
      <li className="group clearfix">
      	<div className="groupTitle group-header">group title</div>
        <ol className="group-inner">
        	{itemList}
        </ol>
      </li>
    );
  }
});

var GridItem = React.createClass({
  setAttributes:function(){},
  getInitialState:function(){
      return {data:this.props.data}
  },
  render: function() {
	var data = this.props.data;
	var attrs = data.attrs;
	var attrList = (attrs)?
	  attrs.map(function(attr, i){
		  return (<GridCell data={attr} key={i} />);
	  }):<GridCell />; 
    return (
      <li>
        <ul className="grid-row tile item">
        	{attrList}
        </ul>
      </li>
    );
  }
});

var GridCell = React.createClass({
    getInitialState:function(){
	return {data:this.props.data}
    },    
    render: function() {
	var data = this.props.data;
	var showLabel;
	if(data.showlabel)
		<label>{data.title}</label>;
    return (
      <li className = {"cell attr " + data.id} 
    	  data-cell-id={data.id} 
    	  data-cell-path={data.path}
    	  data-cell-value={data.value}
    	>
    	{showLabel}
    	<div className="htmlValue" dangerouslySetInnerHTML={{__html:data.displayVal}} />
    	</li>
      // <li className="cell icon attr" data-cell-id="icon"
	// data-cell-path="title" data-cell-value="Adaptive DSL"><div
	// className="icn"><div className="icn-box double"><em
	// className="s0">a</em><em className="s1">d</em></div></div></li>
    );
  }
});

