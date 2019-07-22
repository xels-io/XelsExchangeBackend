
//const bodyParser = require('body-parser');
require('./system/require');


app.use(session({
    secret: 'set',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*2,
        sameSite:true
    }
}));

let httpsPort = 443;
let httpPort = 80;
// configure the app for post request data convert to json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//ssl certificate setup
const http = require('http');
const fs = require('fs');
const https = require('https');

//import ssl certificate
const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl_certificate', 'xels_io.crt')),
    ca: fs.readFileSync(path.join(__dirname, 'ssl_certificate', 'xels_io.ca-bundle')),
    key: fs.readFileSync(path.join(__dirname, 'ssl_certificate', 'xels_io_private_key.key'))
  }

//view config
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static(__dirname+"/assets"));
// end view config



//Every route middleware
app.use(function (req, res, next) {

    if(req.protocol === 'http')
    {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    if(req.headers.host = '52.68.239.4')
    {
        res.redirect(301, `https://exchange.xels.io${req.url}`);
    }
   else
   {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Assassin-RequestHash");
     global.Request = req;
     global.Response = res;
     next();
   }
   
});


/*
    Routes
*/

app.use('/api/v1', ApiRoute); //route prefix(api/v1) is added
app.use('/',WebRoute);

//Didn't match any route then it'll be executed
app.use(function (req, res) {
    res.render('errors/404');
});

/*
    Routes
*/

//create httpsServer
const httpsServer = https.createServer(httpsOptions,app);

 

 httpsServer.listen(httpsPort,()=>{
    console.log(`Listening on port: ${httpsPort}`);
    const Exchange = require('./app/controllers/exchange');
    const exchange = new Exchange();
    setInterval(function () {
        exchange.received();
    },3*60*1000)
    setInterval(function () {
        exchange.sendXels();
    },10*60*1000)
    setInterval(function () {
        exchange.confirmedSendingXels();
    },20*60*1000)


});

var server = http.createServer((req, res) => {
    // console.log(req.headers);
    res.writeHead(301,{Location: `https://${req.headers.host}${req.url}`});
   res.end();
 });
 
server.listen(httpPort);


if(globalConfig.socket==true){
    const socket = require('socket.io');

    const io = socket(server);
    global.IO = io;

    io.on('connection',function(socket){
        global.SOCKET = socket;
        console.log('Socket Connected.connected-id: '+socket.id);

        socket.on('disconnect',function(data){
            console.log('Disconnected id: '+data);
        })
    });
}


//http.createServer(app).listen(port,env.ip);
//app.listen(port,env.ip, ()=>{console.log(`App listening on ${env.ip}:${port}...`)});
