var restify = require('restify');
var mongojs = require("mongojs");
 
<<<<<<< HEAD
var ip_addr = '127.0.0.1';
var port    =  '8080';
=======
var ip_addr = process.env.OPENSHIFT_NODEJS_IP ||  '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT ||  '8080';
>>>>>>> aa263c9ad78263925fcf4a26c38b725c3f67bdd5
 
var server = restify.createServer({
    name : "myapp"
});
var connection_string = '127.0.0.1:27017/myapp';
var db = mongojs(connection_string, ['myapp']);
var jobs = db.collection("jobs");
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
var PATH = '/jobs'
server.get({path : PATH , version : '0.0.1'} , findAllJobs);
server.get({path : PATH +'/:jobId' , version : '0.0.1'} , findJob);
server.post({path : PATH , version: '0.0.1'} ,postNewJob);
server.del({path : PATH +'/:jobId' , version: '0.0.1'} ,deleteJob);

function findAllJobs(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    jobs.find().limit(20).sort({postedOn : -1} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }else{
            return next(err);
        }
 
    });
 
}
 
function findJob(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
	console.log(req.params.jobId)
    jobs.findOne({_id:mongojs.ObjectId(req.params.jobId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }
        return next(err);
    })
}
 
function postNewJob(req , res , next){
    var job = {};
	console.log(req)
    job.title = req.body.title;
    job.description = req.params.description;
    job.location = req.params.location;
    job.postedOn = new Date();
	console.log(job.title)
	console.log(job.description)
	console.log(job.location)
    res.setHeader('Access-Control-Allow-Origin','*');
 
    jobs.save(job , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , job);
            return next();
        }else{
            return next(err);
        }
    });
}
 
function deleteJob(req , res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    jobs.remove({_id:mongojs.ObjectId(req.params.jobId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(204);
            return next();      
        } else{
            return next(err);
        }
    })
 
}

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});
