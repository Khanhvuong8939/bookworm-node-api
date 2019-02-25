import _ from 'lodash';

export default function errorParser(errors) {
    var result  = {}
    _.forEach(errors, (val, key)=>{
        result[key] = val.message
    });
    return result;
}