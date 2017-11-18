
export function timeDisFormat(distancetime) {
  if (distancetime > 0) {
    //如果大于0.说明尚未到达截止时间
    var ms = Math.floor(distancetime % 1000);
    var sec = Math.floor(distancetime / 1000 % 60);
    var min = Math.floor(distancetime / 1000 / 60 % 60);
    var hour = Math.floor(distancetime / 1000 / 60 / 60 % 24);
    let arr = [hour,min,sec,ms];
    return arr.reduce((r,a) => {
      if(a == 0 && r == ""){
        return "";
      }else{
        return r+(r?':':'')+ a;
      }
    },"").replace(/:(?=\d+$)/,'.');
  }
  return '';
}


