import React from 'react';
import {Icon} from 'react-material-icons-blue';
import { Link } from 'react-router';

export function getScoreClassName(score) {
  score = score || '4';
  return `i scr_${score}`;
}

export function getMaintainers(devs,itemIndex) {
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

export function getMaintainersLinked(developers) {
  const maintainers = developers.map((item, index) => {
    const name = item.name || item.developerId;
    if (item.email) {
      return <a key={index} href={`mailto:${item.email}`}>{name}</a>;
    } else {
      return (<span key={index}>{name}</span>);
    }
  });
  return maintainers;
}

export function getLabels(rawLabels) {
  const labels = rawLabels.map((item, index) => {
    return (<div key={index}>
      <Icon icon="label"/>
      <Link to={`/?labelFilter=${item}`} >{item}</Link>
    </div>);
  });
  if(!labels || labels.length === 0) {
    labels.push(<div key={1}>
      <Icon icon="label"/>
      none
    </div>);
  }
  return labels;
}


export function getDependencies(rawdependencies) {
  const dependencies = rawdependencies
    .sort((a, b) => a.optional === b.optional ? 0: a.optional? 1 : -1)
    .map((item, index) => {
    return (<div key={index}>
      {item.optional ? <Icon icon="bookmark_outline"/> : <Icon icon="bookmark"/> }
      {item.name} v.{item.version}
    </div>);
  });
  if(!dependencies || dependencies.length === 0) {
    dependencies.push(<div key={1}>
      <Icon icon="bookmark_outline"/>
      none
    </div>);
  }
  return dependencies;
}

 /* FIXME:
  This isn't the best way to do this, but plugins currently have a lot
  of repetitive goop in their titles.
  plugins leading with 'Jenkins' is particularly bad because then sorting
  on the name lumps a bunch of plugins toggether incorrectly.
  but even 'plugin' at the end of the string is just junk.
  All of these are plugins.
  */
export function cleanTitle(title) {
  return title.replace('Jenkins ','').replace(' Plugin','').replace(' plugin','').replace(' Plug-in','');
}
