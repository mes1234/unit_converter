const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app  = express()
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
var path = require('path');
var units
app.get('/', (req,res)=> res.sendFile(path.join(__dirname, "static/index.html")))
app.use(express.static('static'))
app.listen(3000,()=>console.log('running express server'))

function getBaseConversion(type,obj){
    var currentUnit = obj.filter(checkKey,{name:type})
    return currentUnit
}


function calculateVal(src,dest,val,obj){
    var result = 0
    src_base= getBaseConversion(src,obj)
    dest_base  =getBaseConversion(dest,obj)
    if(typeof src_base[0].adder == "undefined" && typeof dest_base[0].adder == "undefined"){

        result = val / src_base[0].conversion * dest_base[0].conversion
    }
    else{
    result = (val+ src_base[0].adder) / src_base[0].conversion * dest_base[0].conversion-dest_base[0].adder
    }
    return result
}

function checkKey(element){
    var keepElement = true
    var keysToCheck=Object.keys(this)
    
    keysToCheck.forEach((value)=>{
       (this[value]==element[value]) ? (true) : (keepElement=false)
    })
    Object.keys(this).length === 0 ? (keepElement=true) : true
    return keepElement
}

app.post("/var_list",(req,res)=>{
    var check= req.body
    var currentUnit =units.filter(checkKey,check)
    res.send(units.filter(checkKey,{type:currentUnit[0].type}))
    console.log("post req")
})
app.post("/calculate",(req,res)=>{
    console.log("get req to calculate")
    var srcUnit = req.body.sourceunit
    var destUnit = req.body.destunit
    var valtocalc = parseFloat(req.body.valtocalculate)
    res.send({res:calculateVal(srcUnit,destUnit,valtocalc,units)})  
})
app.get("/var_list",(req,res)=>{
    var units_names= []
    units.forEach((value,index)=>{
        units_names.push(units[index].name)
    })
    res.send(units_names)
    console.log("get req")
})
fs.readFile(path.join(__dirname, '/static/json/def.json'), 'utf8', function (err, data) {
    units = JSON.parse(data);
});