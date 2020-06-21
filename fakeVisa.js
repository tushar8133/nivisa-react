var io = require("socket.io").listen(8472);
console.log('Socket listening on port 8472');

io.on('connect', onConnect);

function onConnect(socket) {
  io.emit('join');
  socket.on('comm', function(data) {
    console.log(">>>", data);
    sendSCPI(data.address, data.command).then( resp => {
      io.emit('comm', JSON.stringify(resp));
      console.log("<<<", resp);
    })
  });
}

function sendSCPI(address, query) {
  return new Promise((resolve, reject) => {
    setTimeout( _ => {
      var result = getCmdResponse(query);
      resolve(result);
    }, 100);
  });
}

function getCmdResponse(query) {
    var final = "";
    switch (query) {
        case "DEVICE_CONNECTIONS?":             final = ['USB', 'ETHERNET']; break;
        case "*IDN?":                           final = "\"Anritsu,MW82119B/31/19/850/331,1630010,3.83\""; break;
        case ":INSTrument:CATalog:FULL?":       final = "\"VNA\"2,\"HI_PM\"10,\"MINIPIM\"46"; break;
        case ":INSTrument:NSELect?":            final = pickRandom(["46","10","2"]); break;
        case ":CALibration:PIManalyzer:FULL?":  final = pickRandom(["CAL ON","CAL OFF"]); break;
        case ":PIManalyzer:MEASure:VALue?":     final = createRandom(); break;
        case ":PIManalyzer:MEASure:STATus?":    final = pickRandom(["0","1"]); break;
        case ":PIManalyzer:FREQuency:F1?":      final = pickRandom(["869000000","871000000","871000000"]); break;
        case ":PIManalyzer:FREQuency:F2?":      final = pickRandom(["894000000","894000000","886660000"]); break;
        case ":PIManalyzer:OUTPut:POWer?":      final = "20"; break;
        case ":PIManalyzer:TEST:DURation?":     final = "1"; break;
        case ":PIManalyzer:MODe?":              final = pickRandom(["PIM","SPECTRUM_VIEW","DTP","PIMSwp"]); break;
        default : "";
    }
    return final;
}

function createRandom() {
  var a = Math.floor(Math.random()*(999-100+1)+100);
  var b = a - 20;
  return ("-"+a+".8, -"+b+".8");
}

function pickRandom(arr) {
    var ran = Math.floor(Math.random() * Math.floor(arr.length));
    return arr[ran];
}
