let Key = "Foodie_Guy_info@FDG";
let users;
let display_over_div = document.querySelector(".display_over");
let Login_Form = document.getElementById("Login_form");
let login_Button = document.getElementById("Login_section_LoginButton");
let Cancel_Button = document.getElementById("Cancel_Button");
let logout_Button = document.getElementById("Login_section_LogoutButton");
let found_user_infos = undefined;
let post_section = document.getElementById("post_section");

// Time moment
let time = new Date();
function time_display(time) {
  const date = moment(time);
  const relativeTime = date.fromNow();
  const time_info = date.format("DD-MM-YY");
  return time_info + " (" + relativeTime + ")";
}

// Picture Fetch
let pictureFetcher = async () => {
  try {
    let res = await fetch("https://foodish-api.com/api/");
    let data = await res.json(); // Convert response to JSONW
    return data.image; // Log the image URL
  } catch (err) {
    console.log("Error fetching data:", err);
  }
};
async function RenderingPost(data) {
  console.log(data);
  // post info
  let user_info = document.createElement("h5");
  user_info.innerText = "P" + data.id + " : " + data.created_by;
  let date_info = document.createElement("h5");
  date_info.innerHTML = `${time_display(data.created_at)}`;
  let post_info = document.createElement("div");
  post_info.appendChild(user_info);
  post_info.appendChild(date_info);
  post_info.setAttribute("class", "post_info");
  // post info ends
  let img = document.createElement("img");
  img.src = await pictureFetcher();
  let post_img = document.createElement("div");
  post_img.setAttribute("class", "post_img");
  post_img.appendChild(img);
  let p = document.createElement("p");
  p.textContent = data.content;
  let post_text = document.createElement("div");
  post_text.setAttribute("class", "post_text");
  post_text.appendChild(p);

  let main_div = document.createElement("div");
  main_div.setAttribute("class", "post");
  main_div.appendChild(post_info);
  main_div.appendChild(post_img);
  main_div.appendChild(post_text);
  post_section.appendChild(main_div);
}

let new_post_id;
let posting_fun = (data) => {
  new_post_id = data.length;
  post_limit = 20;
  let index = data.length - 1;
  for (; index >= post_limit; index--) {
    RenderingPost(data[index]);
  }
};

let GET = async (resource) => {
  await fetch(resource)
    .then((res) => {
      // console.log(res)
      let contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        console.log("The Respond (resolved) JSON Data => " + res);
        return res.json();
      } else {
        console.log("The Respond (resolved) but not JSON");
        return res.blob();
      }
    })
    .then((data) => {
      posting_fun(data);
      return data;
    });
};

// [1] When Page is loaded determination of logged in or not
// Request Function

// will Run when Page is loaded [Determine whether user has logged in or not]
let posting_section = document.querySelector(".user_logged_in_post_menu");
window.onload = () => {
  GET("http://localhost:3500/data");
  if (localStorage.getItem(Key)) {
    console.log("Logged In");
    posting_section.style.display = "block";
    let loginSector_NotLoggedIn = document.getElementById("notLoggedin_div");
    loginSector_NotLoggedIn.style.display = "none";
    display_over_div.style.display = "none";
    found_user_infos = JSON.parse(localStorage.getItem(Key));
    document.getElementById(
      "usernamedisplay"
    ).textContent = `User : ${found_user_infos.name}`;
  } else {
    console.log("Not logged IN");
    posting_section.style.display = "none";
    let loginSector_LoggedIn = document.getElementById("Loggedin_div");
    loginSector_LoggedIn.style.display = "none";
    let users_data = fetch("http://localhost:3501/users") // Making a HTTP request
      .then((res) => {
        // console.log(res) // Return Response
        return res.json(); //  parse the JSON data from the response body , it tells the browser to parse (convert) the JSON data from the response body into a JavaScript object. In this case, the JSON data is an array of objects, so it's converted into a JavaScript array of objects.]
      })
      .then((data) => {
        users = data; // Get Actual Data and store in users
      });
  }
};

// Tries to logout
logout_Button.addEventListener("click", (event) => {
  localStorage.removeItem(Key);
  window.location.reload();
});

// [2] When user tries to login
// Using own sorting algorithm
let sort_data = (sort_user_data) => {
  users.forEach((users_data) => {
    console.log(users_data.email);
  });
  console.log(users.length);
};

// Submit Event Listener => [From] Login Pannel
Login_Form.addEventListener("submit", (event) => {
  event.preventDefault();
  // (Filter method)
  let user_login = users.filter((user_data) => {
    console.log("User data ==> " + user_data.email);
    console.log("User input ==> " + Login_Form.Email.value);
    return user_data.email === Login_Form.Email.value;
  });
  console.log("User data obtained ==> " + user_login);
  let found_data = user_login[0];
  console.log(found_data);
  if (found_data == undefined) {
    console.log("NOt found");
  } else {
    console.log("Found data");
    if (Login_Form.Password.value === found_data.password) {
      console.log("Login Successed");
      console.log("Found data ==> " + found_data.name);
      display_over_div.style.display = "None";
      localStorage.setItem(Key, JSON.stringify(found_data));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      window.alert("Warning:: Wrong Password");
    }
  }
  // Filter method ends
});
// User Tries to SignUp
let SignUp = document.getElementById("Login_section_SignUpButton");
SignUp.addEventListener("click", (event) => {
  window.location.href = "SignUp.html";
});

// Header Navigation
let header_navigations = document.querySelectorAll(".nav_ul > li");
header_navigations.forEach((li) => {
  li.addEventListener("click", (event) => {
    let user_choice = event.target.getAttribute("id");
    switch (user_choice) {
      case "Home":
        console.log("i am home");
        break;
      case "Blogs":
        console.log("I am blogs");
        break;
      case "Highlights":
        console.log("I am highlights");
        break;
      case "Search":
        console.log("I am search");
        break;
    }
  });
});

// Call Display over login pannel => [Form] Header
login_Button.addEventListener("click", () => {
  display_over_div.style.display = "flex";
});

// Cancel Event Listener => [From] Login Pannel
Cancel_Button.addEventListener("click", () => {
  display_over_div.setAttribute("style", "display:none;");
});

// [II] Main Page
// (Gallery)
// 1.Dark color theme div plus text inside
let Dark_div = document.querySelector(".content_div_dark");
// ------------------Initiate after 3s
setTimeout(() => {
  Dark_div.innerHTML = "<h1>Welcome to <b>FoodieGuys</b></h1>";
  let WelcomeText = document.querySelector(".content_div_dark > h1");
  WelcomeText.setAttribute("class", "Text_header");
}, 2000);
// ------------------Initiate after 5s
setTimeout(() => {
  let index = 0;
  let p = document.createElement("p");

  let text =
    "your one-stop blog for a variety of user-generated food reviews.\n Explore diverse culinary experiences and flavors from around the world.";
  let speed = 80;
  function Type() {
    if (index < text.length) {
      p.textContent += text.charAt(index);
      index++;
      setTimeout(Type, speed);
    }
  }
  Type();
  Dark_div.appendChild(p);
  p.setAttribute("class", "Text_paragraph");
}, 4000);
// 2. Gallery Div blow Dark div Image changing div
let Gallery = ["Pics/chopping.gif", "Pics/D.gif", "Pics/Egg.gif"];
let Gallery_container = document.querySelector(".content_div_gallery");
let GalleryButtons = document.querySelectorAll(
  ".content_div_gallery_navi > button"
);
let button_container = document.querySelector(".content_div_gallery_navi");
let index = 0;
// ------------------Initiate after 6s and change every 5s
button_container.style.opacity = "100%";
let setTime = setInterval(() => {
  Gallery_container.style.backgroundPosition = "center center";
  Gallery_container.style.backgroundImage = `url(${Gallery[index]})`;
  GalleryButtons[index].style.opacity = "80%";
  if (index === 0) {
    GalleryButtons[GalleryButtons.length - 1].style.opacity = "50%";
  } else {
    GalleryButtons[index - 1].style.opacity = "50%";
  }
  index++;
  if (index === GalleryButtons.length) {
    index = 0;
  }
}, 6000);
setTimeout(() => {
  setTime; // typing function
  button_container.style.display = "flex"; // rendering button_div
}, 8000);
// Gallery Ends

// Post Session
// new post Data

let POST = async (resource, newData) => {
  try {
    let res = await fetch(resource, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    if (!res.ok) {
      console.log("YOu got a problem dude");
      return;
    }

    let data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

// logged in user post setting
let post_buttons = document.querySelectorAll(".navi_post_menu > button");
let imgUrltxt = document.querySelector(".Image_URL input");
let textarea = document.querySelector(".user_logged_in_post_content textarea");
post_buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    let user_choice = event.target.getAttribute("id");
    switch (user_choice) {
      case "image_button":
        {
          let imageURL = document.querySelector(".Image_URL");
          imageURL.style.display = "flex";
          let imgcancelbutton = document.querySelector(".Image_URL button");
          imgcancelbutton.addEventListener("click", (event) => {
            imgUrltxt.value = "";
            imageURL.style.display = "none";
          });
        }
        break;
      case "post_button":
        {
          let postconfirm = window.confirm("Are you sure you wanna post?");
          if (postconfirm) {
            found_user_infos = JSON.parse(localStorage.getItem(Key));
            let new_data = {
              id: `id ${new_post_id}`,
              title: `Item ${new_post_id}`,
              image_url: `${imgUrltxt.value}`,
              content: `${textarea.value}`,
              created_at: time.getTime(),
              created_by: `${found_user_infos.name}`,
            };

            POST("http://localhost:3500/data", new_data);
          }
        }
        break;
      case "clear_button":
        {
          textarea.value = "";
        }
        break;
    }
  });
});
