let obj = {};

export default function dataAPI(method , path , data) {
    console.log(data , 'bbbbbbbbb');
    if(method === 'GET' ) {
        obj = {method };
        
    }else {
        obj ={
            method ,
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify(data)
        }
    }
    return new Promise(function(resolve, reject) {
        const url = "http://localhost:3001/item" + path ;
        fetch(url, obj)
        .then((response) => resolve(response.json()))
        .catch((err) => reject(err))
    })
}