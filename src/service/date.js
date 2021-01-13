export const convertDateToString = (date)=>{
    const convertDate = new Date(date);
    const month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    return converNumber(convertDate.getHours()) + ":" + converNumber(convertDate.getMinutes()) + ":" + converNumber(convertDate.getSeconds()) + " " + convertDate.getDate() + "/" + month[convertDate.getMonth()] + "/" + convertDate.getFullYear();
}

export const convertDateToStringV2 = (date)=>{
    const convertDate = new Date(date);
    const month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    return converNumber(convertDate.getDate() + "/" + month[convertDate.getMonth()] + "/" + convertDate.getFullYear());
}

const converNumber = (number)=>{
    if(number < 10)
        return `0${number}`;
    else
        return String(number)
}