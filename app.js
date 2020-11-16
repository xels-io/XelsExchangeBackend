
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

let httpsPort = globalConfig.httpsPort;
let httpPort = globalConfig.httpPort;
// configure the app for post request data convert to json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//ssl certificate setup
const http = require('http');
const fs = require('fs');
const https = require('https');



//view config
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static(__dirname+"/assets"));
// end view config



//Every route middleware
app.use(function (req, res, next) {
    if(globalConfig.https){
        if(req.protocol === 'http')
        {
            res.redirect(301, `https://${req.headers.host}${req.url}`);
        }
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
   
});


/*
    Routes
*/

app.use('/api', ApiRoute); //route prefix(api/v1) is added
app.use('/',WebRoute);

//Didn't match any route then it'll be executed
app.use(function (req, res) {
    res.render('errors/404');
});

/*
    Routes
*/

//create httpsServer
if(globalConfig.https){

    //import ssl certificate
    const httpsOptions = {
        cert: fs.readFileSync(path.join(__dirname, 'ssl_certificate', 'xels_io.crt')),
        ca: fs.readFileSync(path.join(__dirname, 'ssl_certificate', 'xels_io.ca-bundle')),
        key: fs.readFileSync(path.join(__dirname, 'ssl_certificate', 'xels_io_private_key.key'))
    }

    const httpsServer = https.createServer(httpsOptions,app);



    httpsServer.listen(httpsPort,()=>{
        console.log(`Listening on port(HTTPs): ${httpsPort}`);
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
}


var server = http.createServer(app);
 
server.listen(httpPort,function (req,res) {
    console.log(`Listening on port(HTTP): ${httpPort}`);
    const Exchange = require('./app/controllers/exchange');
    const exchange = new Exchange();
    exchange.received();
});


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
