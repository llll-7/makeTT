//文字列が時間形式(hh:mm)かどうかを判定する
function isFormatHHMM(str) {
    const fmt = RegExp("^([0-1][0-9]|2[0-3]):([0-5][0-9])$");
    return fmt.test(str);
}


//時分文字列(hh:mm)からミリ秒を算出して返す
//時分文字列形式ではなかった場合は0msを返す
function timeStringToMs(hhmm) {
    //1h = 3600000ms
    //1m = 60000ms
    let ms = 0;
    const ret = hhmm.match(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/);
    if (ret != null) ms = Number(ret[1]) * 3600000 + Number(ret[2]) * 60000;
    return ms;
}


//ミリ秒から時分文字列(hh:mm)を作成して返す
function msToTimeString(ms) {
    //1minute = 60000ms
    //1hour = 60minutes = 3600000ms
    const hour = Math.floor(ms / 3600000);
    const minute = Math.floor((ms - 3600000 * hour) / 60000);
    const hh = ("00" + hour).slice(-2);
    const mm = ("00" + minute).slice(-2);
    return `${hh}:${mm}`;
}


function calElapseTime(start, stage, change, artists) {
    //引数が時間形式(hh:mm)でない場合は計算しない
    if (!isFormatHHMM(start) || !isFormatHHMM(stage) || !isFormatHHMM(change)) return "";

    //各時間をミリ秒に変換する
    const startms = timeStringToMs(start);
    let stagems = timeStringToMs(stage);
    let changems = timeStringToMs(change);
    
    //開始時間 > 終了時間の場合、日を跨いでいるとして扱い+1日(1d = 86400000ms)
    //if (startms > endms) endms += 86400000;
    
    //終了時間を行い経過時間(ミリ秒)を算出
    const startTime = startms + (stagems+changems)*artists;
    const stageTime = startTime + stagems;
    const changeTime = stageTime + changems;

    //経過時間(ミリ秒)をhh:mm形式の文字列にして返却する
    return [msToTimeString(startTime), msToTimeString(stageTime), msToTimeString(changeTime)];
}



document.getElementById("make").onclick = function() {
    
    const start = document.forms.myform.start.value; //時間
    const stage = document.forms.myform.stage.value; //min
    const change = document.forms.myform.change.value; //min
    const artists = document.forms.myform.artists.value;
    
    let txt = start + " ~ START\n\n";
    for(let i=0; i<artists; i++) {
        let time = calElapseTime(start, stage, change, i);
        if(i===(artists-1)) {
            txt +=  time[0] +" ~ "+ time[1] + "　" + (i+1) + "\n\n" + time[1] +" ~ "+ "　撤収" +"\n";
        }else {
            txt +=  time[0] +" ~ "+ time[1] + "　" + (i+1) + "\n" + time[1] +" ~ "+ time[2] + "　転換" +"\n";
        }
        
    }
    
    document.getElementById("tt").innerHTML = txt;
};