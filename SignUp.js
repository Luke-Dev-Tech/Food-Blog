//Post
let new_data = {
    name : null,
    email : null,
    password : null
}

let GET = (url) => {
    return fetch(url)
    .then((res) => res.json())
    .then(data => {
        return data;
    })
    .catch((error) => console.log(error));
}

let POST = async (resource , newData) =>{
    try{
        let res = await fetch(resource, {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(newData)
        });
        if(!res.ok){
            console.log("YOu got a problem dude");
            return;
        }

        let data = await res.json();
        console.log(data)
        
    }catch(error){
        console.log(error)
    }
    

};

// SignUp
let preData ;
let signUpable = false;
let Verified_Name = null;
let Verified_Email = null;
let Verified_Password = null;
let signUpForm = document.getElementById("signUp_form");
let childElements = signUpForm.children;
let childNodes = signUpForm.childNodes;
let warning = document.querySelectorAll(".input_and_warning span");


// SignUp username

let inputted_username = document.getElementById("new_username");
inputted_username.addEventListener("keyup", (event) => {
    if(inputted_username.value.length > 2){
        let namecheck = preData.filter(user => {
            return user.name.toLowerCase() == inputted_username.value.toLowerCase();
        });
        if(namecheck.length != 0){
            warning[0].style.display = "block";
            warning[0].style.color = "red";
            warning[0].textContent = "User Name has already taken";
            }
        else{
            // Success 
            warning[0].style.display = "none";
            Verified_Name = inputted_username.value.charAt(0).toUpperCase() + inputted_username.value.slice(1);
            }
    }
    else{
        warning[0].style.display = "block";
        warning[0].style.color = "red";
        warning[0].textContent = "Username too short"
    }
});

// SignUp email
let inputted_email = document.getElementById("new_email");
inputted_email.addEventListener("keyup", (event) => {
    // warning[1].style.display = "none";
    if(!inputted_email.value.includes("@")){
        warning[1].style.display = "block";
        warning[1].textContent = "Require '@' in the address"
    }
    else{
        // Success
        warning[1].style.display = "none";
        Verified_Email = inputted_email.value;
    }
});

// SignUp password
let created_password = null;
let inputted_password = document.getElementById("new_password");
let passowrdFormat =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#])/;
inputted_password.addEventListener("keyup" ,(event) => {
    if(inputted_password.value.length > 8){
        if(passowrdFormat.test(inputted_password.value)){
            warning[2].style.display = "none";
            created_password = inputted_password.value;
        }
        else{
            warning[2].style.bottom = "-8px";
            warning[2].style.display = "block";
            warning[2].textContent = "Capital, small , digit , !@#"
        }
    }
    else{
        warning[2].style.bottom = "-22px";
        warning[2].style.display = "block";
        warning[2].textContent = "Password must be at least 8 characters"
    }

    
});
let confirm_password = document.getElementById("re_password")
confirm_password.addEventListener("keyup" ,() => {
    if (created_password) {
        if(created_password == confirm_password.value){
            // Success 
            warning[3].style.display = "none";
            Verified_Password = created_password;
        }
        else{
            warning[3].style.display = "block";
            warning[3].style.bottom = "-22px";
            warning[3].textContent = "Still not the same with created password"
        }
    }

})
window.onload = async () => {
    try {
        preData = await GET("http://localhost:3001/users");
        console.log(preData)
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    if(!inputted_username.value){
        warning[0].textContent = "Please Enter a name"
     }
     if(!inputted_email.value){
        warning[1].textContent = "Please Enter an email"
     }
     if(!inputted_email.value){
        warning[2].textContent = "Please create password"
     }
}

signUpForm.addEventListener("submit", (event) =>{
event.preventDefault();
    if(Verified_Name && Verified_Email && Verified_Password){
        new_data.name = signUpForm.new_username.value;
        new_data.email = signUpForm.new_email.value;
        new_data.password = signUpForm.new_password.value;
        console.log(new_data)
        POST("http://localhost:3001/users", new_data)
    }


});

