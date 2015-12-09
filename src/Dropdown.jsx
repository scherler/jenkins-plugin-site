//TODO: not sure if router can really help me here....
var Router = window.ReactRouter.Router
var Route = window.ReactRouter.Route
var Link = window.ReactRouter.Link


var Dropdown = React.createClass({
    hashTrack: function(){
		var orgHash = window.location.hash;
		var p = this.props;
		var key = p.k;
		var _actionType = key  + '=';
		var _doAction = p.clickHandler;
		
		var _checkHash = function(e) {
			e = e || {};
            var hash = window.location.hash;
            var hashArry = hash.split(/[\&,\#]/);
            
            $.each(hashArry,function(i,elem){
            	var finder = elem.indexOf(_actionType);
            	var val = elem.split(_actionType)[1];
            	if(finder === 0){
            		// get the full config object to pass along...
            		// TODO: should be a better way to do this with crawling back through my attrs list...
            		$.each(p.attrs,function(i,obj){
            			if(obj.id === val){ e.data = obj; return false;}
            		});  
            		///////////
            		_doAction(val,key,e.data);
            		return false;
            	}
            })
        };

		$(window).on( 'hashchange', _checkHash);
		//_checkHash();
	},
	
	clickHandler:function(e){
		// Check existing hash to make sure hash stat is preserved...
		e.preventDefault();
		var newHashArray = [];
		var currentHashArray = window.location.hash.split(/[\&,\#]/);
		var target = e.currentTarget;
		var $target = $(target).addClass('active');
		var hashValue = target.hash;
		var hashChange = target.hash.substring(1).split('=');
		
		$(target).parent().children('.active').not($target).removeClass('active');
		
		if(currentHashArray.length > 1)
			$.each(currentHashArray,function(i,pair){
				if(pair === '') false;
				else if(pair.indexOf(hashChange[0]+'=' ) === 0 || pair === hashChange[0]){
					newHashArray.push(hashChange.join('='));
				}else
					newHashArray.push(pair);
			});
		else
		    newHashArray.push(hashValue);
		window.location.hash = newHashArray.join('&');
		return false;
	},

	render: function() {
		var p = this.props;
		var key = p.k;
		var click = this.clickHandler;
		this.hashTrack();
		return <div className="dropdown-container dropdown" >
			<button
				data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
				className="dropdown-display btn btn-secondary dropdown-toggle">
					Group
				<i className="fa fa-angle-down"></i>
			</button>
			<div className="dropdown-list dropdown-menu">
				{p.attrs.map(function(attr,i){
				    //return(<DropdownItem key={i} k={key} attr={attr} click={click} />);
					return (<a className="dropdown-item" onClick={click} href={'#' + key + '=' + attr.id}>{attr.title}</a>);
				  })
				}
					
			</div>
		</div>;
	}
});

