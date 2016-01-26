let singular = require('./singular');
let capitalize = require('./capitalize');

let collectionNames = function ({ collection, collectionSingular, collectionSingularUpper }) {
  if (!collection) {
    throw new Error('Invalid store definitions given. No collection name');
  }

  let collectionName = collection,
    collectionNameSingular = collectionSingular || singular(collectionName),
    uCollectionName = capitalize(collection),
    uCollectionNameSingular = collectionSingularUpper || singular(uCollectionName);

  return {
    collectionName,
    collectionNameSingular,
    uCollectionName,
    uCollectionNameSingular
  };

}
 module.exports = collectionNames;
