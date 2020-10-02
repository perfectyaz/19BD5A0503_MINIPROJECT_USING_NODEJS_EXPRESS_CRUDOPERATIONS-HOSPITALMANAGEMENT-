const { request, response } = require('express');
var express= require('express');
var app=express();
var server=require('./server.js')
var config=require('./config.js')
var middleware=require('./middleware.js')
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://localhost:27017';
const dbName='HospitalInventory';
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});

var bodyparser=require('body-parser')
const {mquery}=require('mongoose')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

//getting hospital details
app.get('/hospitaldetails',middleware.checkToken,(req,res)=>{
    console.log('hospitaldetails')
    var data=db.collection('Hospital').find().toArray().then(result =>res.json(result));
 });
 //fetching ventilator details
 app.get('/ventdetails',middleware.checkToken,(req,res)=>{
     console.log('ventilator details')
     var data1=db.collection('Ventilator').find().toArray().then(result=>res.json(result))

 });
 //adding ventilators
 app.post('/addventilator',middleware.checkToken,(req,res)=>{
     console.log('adding a ventilator')
     var hospital_name=req.body.hospital_name
     var hospital_id=req.body.hospital_id
     var ventilator_id=req.body.ventilator_id
     var status=req.body.status
     var item={
         hospital_name:hospital_name,
         hospital_id:hospital_id,
         ventilator_id:ventilator_id,
         status:status
     }
     db.collection('Ventilator').insertOne(item,(err,result)=>{
         if(err) return console.log(err)

         res.json('one item inserted successfully')
     });
 });
 
//search by hospital name
app.post('/search_ventilator_by_hospitalname',middleware.checkToken,(req,res)=>{
    console.log('searching ventilator by hospitalname')
    var hospital_name=req.body.hospital_name
    var data2=db.collection('Ventilator').find({hospital_name:hospital_name}).toArray().then(result=>res.json(result))

});

//search by hospital id
app.post('/search_ventilator_by_hospitalid',middleware.checkToken,(req,res)=>{
    console.log('searching ventilator by hospitalid')
    var hospital_id=req.body.hospital_id
    var data3=db.collection('Ventilator').find({hospital_id:hospital_id}).toArray().then(result=>res.json(result))

});

//search by ventilator id
app.post('/search_ventilator_by_ventilator_id',middleware.checkToken,(req,res)=>{
    console.log('searching ventilator by ventilator_id')
    var ventilator_id=req.body.ventilator_id
    var data4=db.collection('Ventilator').find({ventilator_id:ventilator_id}).toArray().then(result=>res.json(result))

});

//search by status
app.post('/search_ventilator_by_status',middleware.checkToken,(req,res)=>{
    console.log('searching ventilator by status')
    var status=req.query.status
    console.log(status)
    var st={status:status}
    var data5=db.collection('Ventilator').find({status:status}).toArray().then(result=>res.json(result))

});

//update hospitaldetails
app.put('/update_ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log('updating ventilator details')
    var ventilator_id={ventilator_id:req.body.ventilator_id}
    var newvalues={$set:{status:req.body.status}}
    db.collection('Ventilator').updateOne(ventilator_id,newvalues,(err,result)=>{
        if(err) return console.log(err)

        res.json('one value updated')
    })

});

//delete hospitaldetails

app.delete('/delete_ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log('deleting ventilator details')
    var ventilator_id={ventilator_id:req.body.ventilator_id}
    db.collection('Ventilator').deleteOne(ventilator_id,(err,result)=>{
        if(err) return console.log(err)

        res.json('one value deleted')
    })

});



 app.listen('500',(req,res)=>
 {
     console.log('server started')
 })
