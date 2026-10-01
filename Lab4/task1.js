var fullName = "Syed Shadan Raza";
var age = 20;
var interestedIn = "Cloud Computing";

var Biography = {
    name : fullName,
    age : age,
    interest : interestedIn,
    address : {
        Area : "PAF Base Nur Khan",
        city : "rawalpindi",
        country : "Pakistan"
    },
    Degree : "BSCS",
    University : "Air University",
    Semester : 5
};

console.log("Name: " + Biography.name);
console.log("Age: " + Biography.age);
console.log("Street: " + Biography.address.Area);
console.log("City: " + Biography.address.city);
console.log("Country: " + Biography.address.country);
console.log("Degree: " + Biography.Degree);
console.log("University: " + Biography.University);
console.log("Semester: " + Biography.Semester);