function getData(){
return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("data received");
        
    },2000);
})
}
getData().then(data=> console.log(data)
)
async function fetchData(){
    const data = await getData();
    console.log(data);
    
}
fetchData()

//promises with reject 
function getUser(id){
    return new Promise((resolve,reject)=>{
        if(id>0){
            resolve({id,name:'Alice'});
        }
        else{
            reject("Invalid id")
        }
    })
}
getUser(1)
.then(user=>{console.log(user);
})
.then(err =>{console.log("error",err);
})

//using async and await 
async function fetchUser(){
    try{
        const user = await getUser(1);
        console.log("user:" ,user);
    }
    catch(error){
        console.log("Error",error);
        
    }
}
fetchUser()
//Multiple promise 
const p1 = Promise.resolve("First");
const p2 = Promise.resolve("second");
const p3 = Promise.resolve("Third");
Promise.all([p1,p2,p3]).then(values => console.log(values)
)
async function fetchAll(){
    const result = await Promise.all([p1,p2,p3]);
    console.log(result);
    
}
fetchAll()
//chaining promise 
function step1(){
    return Promise.resolve("step 1 done")
}
function step2(prev){
    return Promise.resolve(prev + " step 2 done")
}
step1()
.then(result => step2(result))
.then(final => console.log(final)
)
async function processSteps(){
    const s1 = await step1();
    const s2 =await step2(s1);
    console.log(s2);
    
}
processSteps()
//using promise fetch data from the api 
fetch("https://jsonplaceholder.typicode.com/posts/1")
.then(res => res.json())
.then(result => console.log("result is",result)
)
.then(err=> console.log("error is",err)
)
//fetch data using async/await 
async function fetchPost(){
    try{
        const res = await fetch("https://jsonplaceholder.typicode.com/posts/1")
        const data = await res.json();
        console.log(data);
        
    }
    catch (err){
        console.log("Error",err);
        
    }

}
fetchPost()