updateCenter.doRender = function(e,data){
    function drawIcon(attr,item,config){

      var $div = $('<div class="icn" />');
      var value = $.trim(attr.val.toLowerCase().replace('jenkins','').replace('plugin',''));
      
      if(typeof value !== 'string') return $div.prop('outerHTML');
      
      var $html = $('<div class="icn-box"/>');
      var valArr = value.split(' ');
      var $s0 = $('<em class="s0" />').text(valArr[0].substring(0,1));
      var $s1 = [];
      var className = 'single';
      var s1 = valArr[1];
      if(s1) {
        className = 'double';
        s1 = s1.substring(0,1);
        $s1 = $('<em class="s1" />').text(s1);
      }
      
      $html
        .append($s0)
        .append($s1)
        .addClass(className)
        .appendTo($div);
      
      return $div.prop('outerHTML');
    }


	var config = {
		attrs:[ 
            {id:'icon', title:'icon', path:'title', renderer:drawIcon},
            {id:'scope', title:'scope'},
            {id:'category', title:'category'},
            {id:'title',title:'Title'},//,renderer:titleRenderer, grouper:titleGrouper},
            {id:'excerpt',title:'Description'},
            {id:'buildDate',title:'Created'},//renderer:fromNowRenderer},
            {id:'dependencies',title:'Dependencies'},//,renderer:dependencyRenderer},
            {id:'developers',title:'Maintainers'}//,renderer:maintainerRenderer}
        ]}
	ReactDOM.render(	
      <GridBox data={data.margeData()} config={config} />,
      document.getElementById('grid-box')
    );
};
