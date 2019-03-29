//获取当前时间
function getCurrentTime(){
    var date=new Date();
    var seperator1='-';
    var seperator2=":";
    var seperator3=" ";
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var strDate=date.getDate();
    var hour=date.getHours();
    var minute=date.getMinutes();
    var second=date.getSeconds();
    if(month>=1&&month<=9){
        month="0"+month;
    }
    if(strDate>=0&&strDate<=9){
        strDate="0"+strDate;
    }
    if(hour>=0&&hour<=9){
        hour="0"+hour;
    }
    if(minute>=0&&minute<=9){
        minute="0"+minute;
    }
    if(second>=0&&second<=9){
        second="0"+second;
    }
    var currentTime = year + seperator1 + month + seperator1 + strDate + seperator3 + hour+ seperator2 +minute + seperator2 + second;
    return currentTime;
    }

//删除表格一行
function removeOneData(index,row,table){
    table.splice(index,1)
}
function MoveUp(index,row,table){
    if(index>0){
        let upDate=table[index-1];
        table.splice(index-1,1);
        table.splice(index,0,upDate);
    }
    else{
        alert("已经是第一条,不可上移")
    }
}
function MoveDown(index,row,table){
    
    if ((index + 1) ===table.length){
        alert('已经是最后一条，不可下移');
    } else {
        let downDate = table[index + 1];
        table.splice(index + 1, 1);
        table.splice(index,0, downDate);
    }
}
















export {getCurrentTime,removeOneData,MoveDown,MoveUp}