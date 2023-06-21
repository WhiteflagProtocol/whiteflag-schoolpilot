import _ from "lodash";

export const getDifferences = (newObject: any, originalObject: any): any => {
  let arrayIndexCounter = 0;
  const change = _.transform(newObject, (result: any, value, key) => {
    if (!_.isEqual(value, originalObject[key])) {
      let resultKey = _.isArray(originalObject) ? arrayIndexCounter++ : key;

      result[resultKey] =
        _.isObject(value) && _.isObject(originalObject[key])
          ? getDifferences(value, originalObject[key])
          : value;
    }
  });

  console.log("change", change);

  return !_.isEmpty(change) ? change : null;
};
