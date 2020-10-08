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

module.exports = class RequestData {
    constructor(Request,Response) {
        this.typeOfValue ='string';
        this.isRequired = false;
        this.validation = {
            'error':0,
            'details':{}
        }
        this.value = '';
        this.Request = Request;
        this.Response = Response;

    }
    get(key){
        return this.Request.query[key];
    }

    params(key){
        return this.Request.params[key];
    }
    post(key,isRequired=false,name=''){
        this.isRequired = isRequired;

        if(this.Request.body[key] !==0){
            if((!this.Request.body[key] && isRequired==true)){
                if(typeof this.validation.details[key] == 'undefined'){
                    this.validation.error = this.validation.error+1;
                    this.validation.details[key]={
                        code: 100,
                        title:e.getError(100).title,
                        message:((name.length>0)?name:key)+' '+e.getError(100).message
                    }
                }
                return this;
            }
        }

        this.key = key;
        this.value = this.Request.body[key];
        this.typeOfValue = typeof this.Request.body[key];

        if(typeof this.value=='string'){
            this.value =this.value.trim();
        }
        return this;
    }
    type(type){
        let err = 0;

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

                if(isInteger(this.value)==false){
                    err = 1;
                }

            }else if(type == 'number'){
                if(isNumber(this.value)==false){
                    err = 1;
                }
            }else if(type=='email'){
                if(isEmail(this.value)==false){
                    err = 1;
                }
            }else{

                if(this.typeOfValue != type){
                    err = 1;
                }
            }
        }
        if(err==1){
            if(typeof this.validation.details[this.key] == 'undefined'){
                this.validation.error = this.validation.error+1;
                this.validation.details[this.key]={
                    code: 102,
                    title:e.getError(102).title,
                    message:e.getError(102).message+ucFirst(type)
                }
            }
        }
        return this;
    }
    min(value){

        if((this.typeOfValue == 'string' && this.value.length < value) || (this.typeOfValue == 'number' && this.value < value)){
            if(typeof this.validation.details[this.key] == 'undefined'){
                this.validation.error = this.validation.error+1;
                this.validation.details[this.key]={
                    code: 103,
                    title:e.getError(103).title,
                    message:e.getError(103).message+value
                }
            }

        }
        return this;
    }
    maxLength(value){

        if((this.typeOfValue == 'string' && this.value.length >= value)){
            if(typeof this.validation.details[this.key] == 'undefined'){
                this.validation.error = this.validation.error+1;
                this.validation.details[this.key]={
                    code: 104,
                    title:e.getError(104).title,
                    message:e.getError(104).message+' length '+value
                }
            }
        }
        return this;
    }
    maxNumber(value){
        if((isNumber(this.value) && this.value >= value)){
            if(typeof this.validation.details[this.key] == 'undefined'){
                this.validation.error = this.validation.error+1;
                this.validation.details[this.key]={
                    code: 104,
                    title:e.getError(104).title,
                    message:e.getError(104).message+value
                }
            }
        }
        return this;
    }

    //array or object of values
    disallow(values){

        let match = false;

        for(let value in values){
            if(this.value == values[value]){
                match = true;
                break;
            }
        }

        if(match == true){
            if(typeof this.validation.details[this.key] == 'undefined'){
                let mess = '';
                for(let k in values){
                    if(k == 0){
                        mess += values[k];
                    }else{
                        mess += ', '+values[k];
                    }

                }
                mess+=' are not allowed';
                this.validation.error = this.validation.error+1;
                this.validation.details[this.key]={
                    code: 120,
                    title:'Invalid Input value',
                    message:mess
                }
            }
        }
        return this;
    }

    allow(values){

        let match = false;

        for(let value in values){
            if(this.value == values[value]){
                match = true;
                break;
            }
        }


        if(match == false){
            if(typeof this.validation.details[this.key] == 'undefined'){
                this.validation.error = this.validation.error+1;
                let mess = '';
                for(let k in values){
                    if(k == 0){
                        mess += values[k];
                    }else{
                        mess += ', '+values[k];
                    }

                }
                mess+=' are allowed';
                this.validation.details[this.key]={
                    code: 120,
                    title:'Invalid Input value',
                    message:mess
                }
            }
        }
        return this;
    }
    sameAs(key){
        let name = ucFirst(key).replace('_',' ');
        if(this.Request.body[key] !==0){
            if((!this.Request.body[key])){
                if(typeof this.validation.details[key] == 'undefined'){
                    this.validation.error = this.validation.error+1;
                    this.validation.details[key]={
                        code: 100,
                        title:e.getError(100).title,
                        message:name+' '+e.getError(100).message
                    }
                }
                return this;
            }
        }

        if(this.value !== this.Request.body[key]){
            this.validation.error = this.validation.error+1;
            this.validation.details[this.key]={
                code: 130,
                title:e.getError(130).title,
                message:e.getError(130).message
            }
        }
        return this;
    }
    val(){
        let val = this.value;

        this.value = '';
        this.key = '';
        this.typeOfValue = '';
        this.isRequired = false;

        return val;
    }

    validate(){
        let vs = {...this.validation};
        this.validation = {
            error : 0,
            details:{}
        };
        if(vs.error>0){
            if(this.Request.xhr || this.Request.originalUrl.includes('/api/')){
                vs.err_code = 'INVALID_REQUEST_DATA';
                return this.Response.status(400).send(vs);
            }else{
                let errors = {};
                for(let k in vs.details){
                    errors[k] = vs.details[k].message;
                }
                this.Request.flash('errors', errors);
                this.Request.flash('old', this.Request.body);
                console.log('Request validation ERROR')
                console.log(errors);
                this.Response.redirect(this.Request.header('Referer') || '/');
            }
        }else{
            return true;
        }
    }
}