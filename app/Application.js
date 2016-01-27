/** @flow */
import { actions, searchText, filteredList, plugins } from './resources'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Card, CardWrapper } from './components/Card'
import Footer from './components/Footer'
import Header from './components/Header'
import Immutable from 'immutable'
import React, { PropTypes } from 'react'
import Widget from './components/Widget'
import Highlighter from 'react-highlight-words'
import styles from './Application.css'

Application.propTypes = {
  searchText: PropTypes.string.isRequired,
  generatePluginData: PropTypes.func.isRequired,
  filteredList: PropTypes.instanceOf(Immutable.List).isRequired,
  searchText: PropTypes.string.isRequired,
  plugins: PropTypes.any.isRequired,
  searchPluginData: PropTypes.func.isRequired
}
export default function Application ({
  generatePluginData,
  filteredList,
  searchText,
  plugins,
  searchPluginData
}) {
  
  //FIXME: This isn't the best way to do this, but plugins currently have a lot of repetitive goop in their titles.
  // plugins leading with 'Jenkins' is particularly bad because then sorting on the name lumps a bunch of plugins toggether incorrectly.
  // but even 'plugin' at the end of the string is just junk. All of these are plugins.
  function cleanTitle(title){
    return title.replace('Jenkins ','').replace(' Plugin','').replace(' plugin','').replace(' Plug-in','');
  }
  
  function getScoreClassName(score){
    score = score || '4'
    return 'i scr_' + score;
  }
  function getMaintainers(devs,itemIndex){
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
  
  
  
  return (
      <Widget
        generateData={generatePluginData}
        recordIds={filteredList}
        recordsMap={plugins}
        rowRenderer={
          index => {
            const plugin = plugins.get(filteredList.get(index))
            return (
                
              <div
                key={index}
                className={styles.Row}
              >
                <a href={plugin.wiki} className={styles.Tile}>
                  <div className={styles.Icon}>
                    {plugin.iconDom}
                  </div>
                  
                  <div className={styles.Score}>
                    <span className={getScoreClassName()}></span>
                  </div>
                  <div className={styles.Title}>
                    <h4>{cleanTitle(plugin.title)}</h4>
                  </div>
                  <div className={styles.Version}>
                    <span className={styles.v}>{plugin.version}</span>
                    <span className="jc">
                      <span className="j">Jenkins</span> 
                      <span className="c">{plugin.requiredCore}+</span>
                      </span>
                  </div>
                  
                  <div className={styles.Wiki}>
                    {plugin.wiki}
                  </div>
                  
                  <div className={styles.Excerpt}>
                    {plugin.excerpt}
                  </div>
                  
                  <div className={styles.Authors}>
                    {getMaintainers(plugin.developers,index)}
                  </div>
                  
                </a>
              </div>
            )
          }
        }
        searchData={searchPluginData}
        title={'List of Plugins'}
      />

  )
}

const selectors = createSelector(
  [filteredList, searchText, plugins],
  (filteredList, searchText, plugins) => ({
    filteredList,
    searchText,
    plugins
  })
)

export default connect(selectors, actions)(Application)
