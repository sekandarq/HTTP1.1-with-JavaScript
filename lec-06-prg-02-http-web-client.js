const axios = require('axios');

console.log("## HTTP client started.");

(async () => {

    console.log("## GET request for http://localhost:8080/temp");
    let response = await axios.get('http://localhost:8080/temp');
    console.log("## GET response [start]");
    console.log(response.data);
    console.log("## GET response [end]");

    console.log("## GET request for http://localhost:8080/?var1=9&var2=9");
    response = await axios.get("http://localhost:8080/?var1=9&var2=9");
    console.log("## GET response [start]");
    console.log(response.data);
    console.log("## GET response [end]");

    console.log("## POST request for http://localhost:8080/ with var1 is 9 and var2 is 9");
    response = await axios.post("http://localhost:8080/", "var1=9&var2=9");
    console.log("## POST response [start]");
    console.log(response.data);
    console.log("## POST response [end]");

    console.log("## HTTP client completed.");
    
})();