/**
 * 
 * @param {object} object 
 */
export function objectIterator(object) {
   let st = []
   for(let obj in object){
       if(object[obj]!=""){
        st.push(obj+"="+object[obj])
       }
   }
    return "?"+st.join('&')
}
  