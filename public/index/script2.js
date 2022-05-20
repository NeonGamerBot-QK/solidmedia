const format = new window.Formatter();

window.addEventListener('load', init);
var month_name=new Array(12);
 (() => {
   
    month_name[0]="January"
    month_name[1]="February"
    month_name[2]="March"
    month_name[3]="April"
    month_name[4]="May"
    month_name[5]="June"
    month_name[6]="July"
    month_name[7]="August"
    month_name[8]="September"
    month_name[9]="October"
    month_name[10]="November"
    month_name[11]="December"
    
})();
function loadposts(min =0, max=5) {
return new Promise(async (res,rej) => {
const load_more_button = document.createElement('button')
load_more_button.classList.add('load-more-btn')
load_more_button.type = "button"
load_more_button.innerText="Load More"
let posts = await fetch('/api/posts/homepage', {
	headers: {
	"Content-Type": "application/json"
},
    }).then(r => r.json())
posts.reverse()
posts = posts.slice(min,max)  
posts.forEach((post, i) => {
const post_container = document.createElement('div')
const post_row = document.createElement('div')
const user_profile = document.createElement('div');
const p = document.createElement("p");
const avatar = document.createElement("img")
const inner_div_user = document.createElement("div")
const username = document.createElement("p");
	const date_published = document.createElement('span')
username.innerHTML = post.author.name || post.author.username
date_published.innerHTML = new Date(post.createdAt).toLocaleString().split(',')[0]
avatar.src = post.author.avatar || "/images/default.png"
p.classList.add("post-text")
post_container.classList.add("post-container")
post_row.classList.add("post-row")
        
user_profile.classList.add("user-profile")
p.innerHTML = format.getHTML( post.description );

//  Appends
inner_div_user.append(username)
inner_div_user.append(date_published)
user_profile.append(avatar)
user_profile.append(inner_div_user)
post_row.append(user_profile)
post_row.innerHTML +=  '<a href="#"><i class="fas fa-ellipsis-v"></i></a>'
post_container.append(post_row)
post_container.append(p)
if(post.images && Array.isArray(post.images)) {
post.images.forEach((buff) => {
const itag = document.createElement('img')
itag.src = buff // data:image/png;base64,...
itag.classList.add("post-img")
post_container.append(itag)
})

}
post_container.innerHTML += `
<div class="post-row">
<div class="activity-icons"> 
<div><i class="fa fas fa-regular fa-thumbs-up ${post.likes?.includes(post.author._id) ? 'liked' : "no-like"}"></i>${post.likes?.length || 0}</div>
<div><img src="/images/comments.png" alt="0 comments">0</div>
<div><img src="/images/share.png" alt="0  shares">0</div>
</div>
<div class="post-profile-icon">
    <img src="${post.author.avatar || "/images/default.png"}"><i class="fas fa-caret-down"></i>
</div>
`
// window.addEventListener('load', () => {
    const m = 
    document.getElementsByClassName("main-content")[0]
    m.appendChild(post_container)
    console.log(i, posts.length)
    if(i+1 === posts.length) {
        m.appendChild(load_more_button)
        }
    // })
})
	res(posts)

})
}
async function init() {
var post_body = {
description: "",
imgs: [],
author: {}
};
console.log("Script Loaded!!");
const date_day = document.getElementById('myeventdateday');
const date_month = document.getElementById('myeventdatemonth');
const date = new Date();
date_day.innerHTML = date.getDay() - 1
date_month.innerHTML = month_name[date.getMonth()]
const statuses = [{
    div: document.createElement('div'),
    avatar: document.createElement('img'),
    text: document.createElement("p"),
    sync: function ( ) {
        this.div.append(this.avatar)
        this.div.append(this.text)
    }
}, {
    div: document.createElement('div'),
    avatar: document.createElement('img'),
    text: document.createElement("p"),
    sync: function ( ) {
        this.div.append(this.avatar)
        this.div.append(this.text)
    }
}]
console.log(statuses)
statuses.forEach(function (status) {
    status.avatar.src = "https://media.discordapp.net/attachments/875819331353731106/938816117823123527/gay.png"
    status.div.className = "story"
    status.div.style.background = "linear-gradient(transparent, rgba(0,0,0,0.5)), url('https://media.discordapp.net/attachments/875819331353731106/938816117823123527/gay.png');"
    status.text.innerHTML = "Saahil being a bit gay"
    status.sync()
document.getElementsByClassName('story-gallery')[0].append(status.div)
})
document.getElementById('user-profile').addEventListener('click', function(e) {
    let settingsmenu = document.querySelector(".settings-menu")
    settingsmenu.classList.toggle('settings-menu-height')
})
const darkBtn = document.getElementById('dark-btn');

darkBtn.addEventListener('click', function(e) {
darkBtn.classList.toggle('dark-btn-on')
document.body.classList.toggle('dark-theme')
if(localStorage.getItem('theme') === "light") {
    localStorage.setItem('theme', "dark")
} else {
    localStorage.setItem('theme', "light")
    
}
})
if(localStorage.getItem('theme') === "light") {
document.body.classList.remove('dark-theme')
darkBtn.classList.remove('dark-btn-on')
} else if(localStorage.getItem('theme') === "dark") {
    document.body.classList.add('dark-theme')
    darkBtn.classList.add('dark-btn-on')  
} else {
    localStorage.setItem('theme', 'light')
}
fetch('/api/user').then((r) => r.json()).then((user) => {
sessionStorage.user = JSON.stringify(user)
const avatars = document.getElementsByClassName("profile-picture-js")
post_body.author = user;
for (var i = 0; i < avatars.length;i++) {
avatars[i].src = user.avatar || "/images/default.png"
}
document.getElementById('photo').addEventListener('click', () => {
console.log("Clicked")
document.getElementById("img-input").click()
})

document.getElementById('img-input').addEventListener("input", async (e) => {
const index= post_body.imgs.length
const imgData = await GetFileData("#img-input", index)
console.log(index, imgData)
post_body.images.push(imgData)
const imgElement = document.createElement('img')
imgElement.id = index;
imgElement.src = imgData;
document.getElementById("images-post").append(imgElement)
// post_body.disabled = true;

// console.log(body, JSON.stringify(body))
    
})

})
function post() {
fetch('/api/posts/create', {
        body: JSON.stringify(post_body),
headers: {
	"Content-Type": "application/json"
},
        method: 'POST',
    }).then(res => res.text()).then(j => {
  //  alert(j);
// post_body = {};
post_body.reset()
document.getElementsByClassName('post-text')[0].value = ""
// post_body.disabled = false;
    })
  
}
;(() =>{
const profile_img = document.getElementById('user-profile-edit')
console.log(profile_img)
profile_img.addEventListener("mouseover", event => {
 profile_img.classList.add('user-profile-me')
  console.log("In")

});

profile_img.addEventListener("mouseout", event => {
 profile_img.classList.remove('user-profile-me')
  console.log("OUt")
});
profile_img.addEventListener("click", () => {
alert("Clicky ")
})
})()
}
loadposts().then((p) => console.log(`Loaded ${p.length} posts`))
function GetFileData(id, index = 0) {
return new Promise((res,rej) => {
// get a reference to the file input
  const fileInput = document.querySelector(id);

  // listen for the change event so we can capture the file
  // fileInput.addEventListener("change", (e) => {
    // get a reference to the file
    const file = fileInput.files[index];
    // encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {
      // log to console
      // logs data:<type>;base64,wL2dvYWwgbW9yZ...
      res(reader.result)
    };
    reader.readAsDataURL(file);
  // });
})
}
