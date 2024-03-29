/*
* Title: Exercise # - Lab 2 
* Description: Building a RESTful Web Service - To Do List 
* Name: Ngoc Nguyen 
* Date: 9/24/2023
* Section: 004
*/



const http = require('http');
const url = require('url');
var path = require('path');

list =[]; 

 //Exercise 2: To do list

const request_Handler = (req, res) =>{
    path = url.parse(req.url, true).pathname;// extracts the string starting from/
    let i = parseInt(path.slice(1),10);
    let item = ' ';
    switch(req.method){ //Routing logic
        case 'POST': //This is the same is if else statement
            
            req.setEncoding('utf-8');
            req.on('data', (chunk)=>{
                item += chunk;
            }); 
            req.on('end',()=>{
                list.push(item) //Add item to the list
                //Using map and join to create the new list. 
                let new_list = list.map(function(item, i){
                    return(i+1) + ')' + [item];
                }).join('\n');
                
                res.end('OK\n');
                if (list.length === 0){
                    res.end('Well done! Your todo list is empty now.')
            console.log(list);
            }});
            break;

        case 'GET': //Display the todo list to the server. 
            if (list.length===0){
                res.end('Your todo list is empty. Well done!')
            }else{
                new_list = list.map(function(item, i){
                    return(i+1) + ')' + [item];
                }).join('\n'); 
                res.end(new_list ); 

            };
            break; 
        
        case 'DELETE': 
            // curl -X "DELETE" localhost:3000/1
            // command line: curl.exe -X DELETE http://localhost:3000/1 for WINDOWS OS
          
            if(!list[i]){
                res.end('Item not found');
            }
            else{
                list.splice(i, 1); // delete at the [i] location and delete that value.
                new_list = list.map(function(item, i){
                    return(i+1) + ')' + [item];
                }).join('\n'); 
                console.log('OK\n')
                res.end(new_list)};
            break; 

        case 'PUT': // command line: curl.exe -X PUT -d ' ' http://localhost:3000/1 for WINDOWS OS
            req.setEncoding('utf-8'); 
            req.on('data', (chunk)=>{
                item += chunk;
            }); 
            req.on('end',()=>{
                if(!list[i]){
                    res.end('Item not found');
                }
                else{
                    list.splice(i, 1, [item]); // add item to the list at the specific location. 
                    console.log('This is item added:\n' + item); 
                    new_list = list.map(function(item, i){
                        return(i+1) + ')' + [item];
                    }).join('\n'); 
                    console.log('New list:\n'+ new_list)
                    res.end('OK\n')}});
            break; 
}}; 
//This is the call back function
//Create a server object that will respond to any request with a string
const server = http.createServer(request_Handler);



//The server will listen on port 3000
server.listen(3000,function(){
    console.log('The server is listening on port 3000');
});
