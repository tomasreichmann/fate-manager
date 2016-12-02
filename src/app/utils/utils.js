export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function seq(count){
  return Array(count).fill(null).map( (item, index)=>( index ) );
}

export function getIn(obj, path){
  return path.split(".").reduce( (ref, key)=>(
    typeof ref === "object" && key in ref ? ref[key] : undefined
  ), obj);
}

/* intersperse: Return an array with the separator interspersed between
 * each element of the input array.
 *
 * > _([1,2,3]).intersperse(0)
 * [1,0,2,0,3]
 */
export function intersperse(arr, sep) {
    if (arr.length === 0) {
        return [];
    }

    return arr.slice(1).reduce(function(xs, x, i) {
        return xs.concat([sep, x]);
    }, [arr[0]]);
}
