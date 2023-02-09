export function getCurrentDate(){
    const dateObject = new Date()
   
    const day = ("0" + dateObject.getDate()).slice(-2)
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const year = dateObject.getFullYear();
    const hours = ("0" + (dateObject.getHours())).slice(-2);;
    const minutes = ("0" + (dateObject.getMinutes())).slice(-2)
    const seconds = ("0" + (dateObject.getSeconds())).slice(-2)
   
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


