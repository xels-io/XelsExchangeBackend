/*
 @Purpose:to get requested data from url query string,url parameter or post body with some basic validation
 @use: require this request in every controller then use this methods
*/

const e = require('../config/errors');


/*

 allow types = number,int,boolean,string,float
 number = float : any number value (allow +-)
 boolean = bool : true/false
 int = integer : any number without point allow +-

*/

class RequestData {
    constructor() {
        this.typeOfValue ='string';
        this.isRequired = false;

    }
    get(key,isRequired=false){
        this.isRequired = isRequired;

        if(Request.query[key] !==0){
            if((!Request.query[key] && isRequired==true)){
                globalObj.errorRes(100,key+' '+e.getError(100).title,key+' '+e.getError(100).message);
            }
        }

        this.key = key;
        this.value = Request.query[key];

        this.typeOfValue = typeof this.value;

        if(typeof this.value=='string'){
            this.value =this.value.trim();
        }

        return this;
    }

    param(key){
        this.key = key;
        this.value = Request.params[key];

        this.typeOfValue = typeof this.value;

        if(typeof this.value=='string'){
            this.value =this.value.trim();
        }
        return this;
    }
    post(key,isRequired=false){
        this.isRequired = isRequired;

        if(Request.body[key] !==0){
            if((!Request.body[key] && isRequired==true)){
                globalObj.errorRes(100,key+' '+e.getError(100).title,key+' '+e.getError(100).message);
            }
        }

        this.key = key;
        this.value = Request.body[key];
        this.typeOfValue = typeof Request.body[key];

        if(typeof this.value=='string'){
            this.value =this.value.trim();
        }
        return this;
    }
    type(type){

        type = type.toLowerCase();


        if(type=='int'){
            type = 'integer';
        }

        else if(type == 'bool'){
            type = 'boolean';
        }

        else if(type == 'float'){
            type = 'number';
        }




        if(this.value){
            if(type == 'integer'){

                if(globalObj.isInteger(this.value)==false){

                    globalObj.errorRes(102,globalObj.ucFirst(type)+' '+e.getError(102).title+' for '+ this.key,globalObj.ucFirst(type)+' '+e.getError(102).message+' for '+ this.key);
                }

            }else{

                if(this.typeOfValue != type){
                    globalObj.errorRes(102,globalObj.ucFirst(type)+' '+e.getError(102).title+' for '+ this.key,globalObj.ucFirst(type)+' '+e.getError(102).message+' for '+ this.key);
                }
            }
        }

        // if((this.typeOfValue!='integer' && typeof this.value != this.typeOfValue) || (this.typeOfValue=='integer' && globalObj.isInteger(this.value)==false)){
        //     globalObj.errorRes(102,globalObj.ucFirst(this.typeOfValue)+' '+e.getError(102).title+' for '+ this.key,globalObj.ucFirst(this.typeOfValue)+' '+e.getError(102).message+' for '+ this.key);
        // }

        return this;
    }
    required(){
        if(this.value.length == 0){
            globalObj.errorRes(100,this.key+' '+e.getError(100).title,this.key+' '+e.getError(100).message);
        }
        return this;
    }
    min(value){

        if((this.typeOfValue == 'string' && this.value.length < value) || (this.typeOfValue == 'number' && this.value < value)){
            globalObj.errorRes(103,value+' '+e.getError(103).title+' for '+ this.key,value+' '+e.getError(103).message+' for '+ this.key);
        }
        return this;
    }
    max(value){

        if((this.typeOfValue == 'string' && this.value.length < value) || (this.typeOfValue == 'number' && this.value > value)){
            globalObj.errorRes(104,value+' '+e.getError('104').title+' for '+ this.key,value+' '+e.getError('104').message+' for '+ this.key);
        }
        return this;
    }

    //array or object of values
    disallow(values){

        let match = false;

        for(let value in values){
            if(this.value === values[value]){
                match = true;
                break;
            }
        }

        if(match == true){
            globalObj.errorRes(120,this.key+' '+e.getError('120').title+' '+ this.value,this.key+' '+e.getError('120').message+' '+ this.value);
        }
        return this;
    }

    allow(values){

        let match = false;

        for(let value in values){
            if(this.value === values[value]){
                match = true;
                break;
            }
        }

        if(match == false){
            globalObj.errorRes(120,this.key+' '+e.getError('120').title+' '+ this.value,this.key+' '+e.getError('120').message+' '+ this.value);
        }
        return this;
    }




}

module.exports = new RequestData();