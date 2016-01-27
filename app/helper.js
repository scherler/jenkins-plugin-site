import React from 'react'

export function getScoreClassName(score){
  score = score || '4';
  return 'i scr_' + score;
}

export function getMaintainers(devs,itemIndex){
  var maintainers = [];
  if(devs){
    for(var i = 0; i < devs.length; i++){
      var devIndex = itemIndex + '_' + i;
      var dev = devs[i].name || devs[i].developerId;
      maintainers.push(
          <div key={devIndex}>{dev}</div>
      );
    }
  }
  return maintainers;
}

 //FIXME: This isn't the best way to do this, but plugins currently have a lot of repetitive goop in their titles.
  // plugins leading with 'Jenkins' is particularly bad because then sorting on the name lumps a bunch of plugins toggether incorrectly.
  // but even 'plugin' at the end of the string is just junk. All of these are plugins.
export function cleanTitle(title){
  return title.replace('Jenkins ','').replace(' Plugin','').replace(' plugin','').replace(' Plug-in','');
}
