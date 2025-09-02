// Write a function delay(ms) that returns a Promise which resolves after ms milliseconds.
// function delay(ms){
//     return new Promise(resolve => setTimeout(resolve,ms))
// }
// async function run(){
//     console.log("Start");
//     await delay(2000);
//     console.log("2 second later");
    
// }
// run()
// // question 2
// // Write a function fetchData() that returns a Promise.
// // After 3 seconds, it should either:
// // resolve with the message "Data fetched successfully!"
// // or reject with the message "Error fetching data!" (randomly).
// // function delay1(){
// //     return new Promise((resolve,reject)=>{
// //         setTimeout(()=>{

// //             resolve("data Fetched successfully");
// //         },3000)
// //     })
// // }
// // delay1().then(data=>console.log("data",data)
// // )
// // delay1().then(err=>console.log("error",err)
// // )
// function delay1() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (Math.random() > 0.5) {
//         resolve("Data fetched successfully");
//       } else {
//         reject("Error fetching data");
//       }
//     }, 3000);
//   });
// }

// delay1()
//   .then(data => console.log("fetched", data))
//   .catch(err => console.log("error", err));
//   async function showResult(){
//     try{
//     const result = await delay1()
//     console.log(result);
//     }
//     catch{
//         console.log("error is",err);
        
//     }
    
//   }
//   showResult()
// //Write a function checkNumber(num) that returns a Promise.
// // If num is even, resolve with the message:
// // "The number X is even"
// // If num is odd, reject with the message:
// // "The number X is odd"
// function giveResult(num){
//     return new Promise((resolve,reject)=>{
//         if(num%2 === 0){
//             return resolve("no is even")
//         }else{
//             return reject("number is odd")
//         }
//     })
// }
// giveResult(8)
// .then(data =>console.log(data))
// .catch(error=>console.log(error))

// // Write a function greet(name) that returns a Promise.

// // After 2 seconds, it should:

// // resolve with the message: "Hello, <name>!"

// // If the name is empty (""), after 2 seconds it should:

// // reject with the message: "Name is required!"

// function greetName(name){
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             if(name && name.trim !== ""){
//                 resolve(`hello ${name}`)
//             }
//             else{
//                 reject("name is required")
//             }
//         },2000)
//     })
// }
// greetName('kanhaiya')
// .then(data=>console.log("name fetched successfully",data))
// .catch(error =>console.log("error",error))

// async function showName(){
//     try{
//     const data = await greetName('kanhaiya');
//     console.log(data);
//     }catch{
//         console.log(error);
        
//     }
// }
// showName()

// //Challenge: Countdown Timer with Promises

// // Write a function countdown(start) that:

// // Takes a number start.

// // Prints the countdown (start, start-1, ... 1) one number per second.

// // After reaching 0, resolves with  Countdown complete!".
// function countDown(start) {
//   return new Promise((resolve) => {
//     function step(n) {
//       if (n > 0) {
//         console.log(n);
//         setTimeout(() => step(n - 1), 1000);
//       } else {
//         resolve("🎉 Countdown complete!");
//       }
//     }
//     step(start);
//   });
// }

// // Usage
// countDown(5)
//   .then(msg => console.log(msg))
//   .catch(err => console.log(err));


//   //using async/await syantx 
//   function delay(ms){
//     return new Promise(resolve => setTimeout(resolve,ms))
//   }
//   async function showCountDown(start){
//     for(let i = start;i>=0;i--){
//         console.log(i);
//         await delay(1000);
//     }
//     console.log("countDown completed");
    
//   }
//   showCountDown(6)


// //   Write a function autoCountdown(start) that:

// // Counts down from start to 1 (just like before, one number per second).

// // When it reaches 0, it prints  "Countdown complete!".

// // Then, after a 5-second pause, it automatically starts the countdown again.

// // This should repeat forever (or until you stop the program).
// // helper for waiting
// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function autoCountDown(start) {
//   while (true) { // repeat forever
//     for (let i = start; i > 0; i--) {
//       console.log(i);
//       await delay(1000); // wait 1 sec between numbers
//     }
//     console.log(" Countdown complete!");
//    // await delay(5000); // wait 5 sec before restarting
//   }
// }

// // Usage
// autoCountDown(3);
//exercise 1: Random Joke Fetcher

//  Use https://official-joke-api.appspot.com/random_joke

// Write a function using async/await to fetch a random joke.

// Print it in the format:
async function fetchDataFromApi() {
  try {
    const response = await fetch("https://official-joke-api.appspot.com/random_joke");
    const data = await response.json(); // convert response to JSON

    console.log(`${data.setup}  ${data.punchline}`);
  } catch (error) {
    console.log(" Error fetching joke:", error);
  }
}

fetchDataFromApi();
