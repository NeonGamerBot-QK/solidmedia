init()
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//FORMAT;
async function main() {
const user = JSON.parse(sessionStorage.user);
const post_body = document.getElementById('post-input');
post_body.value = ""
const post_btn = document.getElementById('post-btn');
const posts_div = document.getElementById("posts")
console.log("loaded")
post_btn.addEventListener('click', (e) => {
   let body = {};
body.description = post_body.value
post_body.disabled = true;
console.log(body, JSON.stringify(body))
    fetch('/api/posts/create', {
        body: JSON.stringify(body),
headers: {
	"Content-Type": "application/json"
},
        method: 'POST',
    }).then(res => res.text()).then(j => {
  //  alert(j);
post_body.value = "";
post_body.disabled = false;
    })
    
})
fetch('/api/posts/homepage', {
	headers: {
	"Content-Type": "application/json"
},
    }).then(res => res.json()).then((posts) => {
posts.reverse()
posts = posts.slice(0,100)  
posts.forEach((post, index) => {
const post_div = document.createElement('div');
const title = document.createElement('h1');
const date = document.createElement('span');
const info = document.createElement('p');
const ownericon = document.createElement('i')
const modicon = document.createElement('i')
const delete_button = document.createElement('button');
const edit_button = document.createElement('button');
const edit_text = document.createElement('textarea');

const like_button = document.createElement('button');
like_button.id = "like_button_"+post._id;
if(post.likes && post.likes.includes(user._id)) {
like_button.innerHTML = "<i class='fas fa-heart liked'></i>";
like_button.liked = true;
} else {
like_button.innerHTML = "<i class='far fa-heart '></i>"
}

like_button.addEventListener('click', (e) => {
const btn = document.getElementById(like_button.id);
console.log(btn.classList.contains('liked'), btn.className.includes("liked"), btn.className)
if(btn.classList.contains('liked') || btn.className.includes("liked"))  {
btn.innerHTML = "<i class='far fa-heart '></i>";
btn.classList.remove('liked')
console.log("unfilling")
} else {
console.log("filling")
btn.innerHTML = "<i class='fas fa-heart liked'></i>";
}
});
edit_text.id = 'edit-post-textfield-'+post._id
edit_button.addEventListener('click', async (e) => {
let body = { description: document.getElementById('edit-post-textfield-'+post._id).value, edited:true, LastUpdated: new Date().toISOString() }
console.log(body)
document.getElementById('edit-post-textfield-'+post._id).value = "";
const res = await fetch("/api/posts/" + post._id + "/edit", { method: "PATCH", headers: { "Content-Type" : "application/json"}, 
body: JSON.stringify(body)
}).then(r => r.status);
//console.log(res, "/api/posts/" + post._id + "/edit")
if(res === 200) {
alert("post edited");
window.location.reload();
} else {
    alert(":(")
}
})
edit_button.innerHTML = "Edit";
edit_text.innerHTML = ""
modicon.classList = "fas fa-shield-alt sheild icon"
ownericon.classList = "fas fa-crown crown";
date.innerHTML = new Date(post.createdAt).toLocaleString("en-US", {timeZone: timezone }).split(',')[0]
delete_button.innerText = "Delete"
delete_button.style['background-color'] = "red"
delete_button.addEventListener('click', (e) => {
fetch(`/api/posts/${post._id}/delete`, { method: "DELETE" }).then((r) => {
if(r.status === 204) {
	confirm("Post deleted")
window.location.reload()
} else {
r.text().then(e => {
console.error(e)
alert(e)
})
}

})
})

title.innerHTML = post.author.name;
if(post.author.owner) title.append(ownericon)
if(post.author.mod) title.append(modicon)
info.innerHTML = post.description;
post_div.id = post._id;
post_div.append(title);
post_div.append(info)
post_div.append(date)
post_div.append(like_button)
console.log(user._id === post.author._id)
if(user._id === post.author._id) {
post_div.append(document.createElement('br'))
post_div.append(delete_button)
post_div.append(document.createElement('br'))
post_div.append(edit_text)
post_div.append(edit_button)
}
posts_div.append(post_div)
//console.log(title.innerHTML)
})
})
}
async function init() {
sessionStorage.user = await fetch("/api/user").then(e => e.text())
}
window.addEventListener('DOMContentLoaded', main);
//e/