import React from 'react';

export function getScoreClassName(score){
  score = score || '4';
  return `i scr_${score}`;
}

export function getMaintainers(devs,itemIndex){
  const maintainers = [];
  if(devs){
    for(let i = 0; i < devs.length; i++){
      const devIndex = `${itemIndex}_${i}`;
      const dev = devs[i].name || devs[i].developerId;
      if( i>1 && i+1 < devs.length ){
        maintainers.push(
          <div key={devIndex}>({devs.length - 2} other contributers)</div>
        );
        i = devs.length;
      }
      else{
        maintainers.push(
          <div key={devIndex}>{dev}</div>
        );
      }
    }
  }
  return maintainers;
}

 /* FIXME:
  This isn't the best way to do this, but plugins currently have a lot
  of repetitive goop in their titles.
  plugins leading with 'Jenkins' is particularly bad because then sorting
  on the name lumps a bunch of plugins toggether incorrectly.
  but even 'plugin' at the end of the string is just junk.
  All of these are plugins.
  */
export function cleanTitle(title){
  return title.replace('Jenkins ','').replace(' Plugin','').replace(' plugin','').replace(' Plug-in','');
}
