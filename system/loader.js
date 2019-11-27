let fs = require('fs');
let path = require('path');

allFilesSync = (dir,allfiles = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if(fs.statSync(filePath).isDirectory()){
            allFilesSync(filePath,allfiles)
        }else{
            allfiles.push({
                file:file,
                path:filePath
            })
        }

    });
    return allfiles
};
dirMapTree = (dir, fileList = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);

        fileList.push(
            fs.statSync(filePath).isDirectory()
                ? {[file]: dirMapTree(filePath)}
                : file
        )
    });
    return fileList
};


loadModel =(model)=>{
    let coreModel =  require(`../app/models/${model}`);
    return new coreModel;
};

loadLibrary = (library) => {
    return require(`../app/libraries/${library}`);
};

loadConfig = (config) => {
    return require(`../config/${config}`);
};

loadMiddleware = (middleware) =>{
    return require(`../app/middleware/${middleware}`);
};
loadCore = (core) =>{
    return require(`../core/${core}`);
};
loadENV = () =>{
    return require(`../env`);
};
controller = (controllerPath) => {
    let split = controllerPath.split("/");
    let path = controllerPath.replace('/'+split[split.length-1],'');
    let Controller = require(`../app/controllers/${path+'Controller'}`);
    let controller = new Controller();
    return controller[split[split.length-1]];
};

loadValidator = (req,res) =>{
    let validator = require(`../core/request_data`);
    return new validator(req,res);
};

