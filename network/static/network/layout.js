
document.addEventListener('DOMContentLoaded', () => {
    let active = document.querySelector('.body').dataset.page;
    document.querySelector("#"+active).classList.add('active');
});


function createpost() {
    let popup = document.querySelector(".popup");
    popup.style.display = 'block';
    popup.querySelector('.large-popup').style.display = 'block'
    document.querySelector('.body').setAttribute('aria-hidden', 'true');
    document.querySelector('body').style.overflow = "hidden";
    document.querySelector('#insert-img').onchange = previewFile;
    popup.querySelector('.large-popup').querySelector('form').setAttribute('onsubmit', '');
    popup.querySelector('.large-popup').querySelector("#post-text").addEventListener('input', (event) => {
        if(event.target.value.trim().length > 0) {
            popup.querySelector('.submit-btn').disabled = false;
        }
        else if(event.target.parentElement.querySelector('#img-div').style.backgroundImage) {
            popup.querySelector('.submit-btn').disabled = false;
        }
        else {
            popup.querySelector('.submit-btn').disabled = true;
        }
    });
}


function remove_popup() {
    let popup = document.querySelector('.popup');
    popup.style.display = 'none';
    document.querySelector('.body').style.marginRight = '0px';
    document.querySelector('.body').setAttribute('aria-hidden', 'false');
    document.querySelector('body').style.overflow = "auto";
    let small_popup = document.querySelector('.small-popup');
    let large_popup = document.querySelector('.large-popup');
    let login_popup = document.querySelector('.login-popup');
    small_popup.style.display = 'none';
    large_popup.style.display = 'none';
    login_popup.style.display = 'none';
    large_popup.querySelector('#post-text').value = '';
    large_popup.querySelector('#insert-img').value = '';
    large_popup.querySelector('#img-div').style.backgroundImage = '';
    large_popup.querySelector('#img-change').value = 'false';
    large_popup.querySelector('#img-div').style.display = 'none';
}

function login_popup(action) {
    let popup = document.querySelector('.popup');
    popup.style.display = 'block';
    popup.querySelector('.login-popup').style.display = 'block';
    document.querySelector('.body').setAttribute('aria-hidden', 'true');
    document.querySelector('body').style.overflow = "hidden";
    if(action === 'like') {
        document.querySelector('.icon-div').innerHTML = `
        <svg width="2.5em" height="2.5em" viewBox="0 0 16 16" class="bi bi-heart-fill" fill="#e0245e" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>`;
        document.querySelector('.main_text-div').querySelector('h2').innerText = 'Like a post to share the love';
    }
}


function previewFile() {
    document.querySelector('#img-div').style.display = 'block';
    document.querySelector('#spinner').style.display = 'block';
    document.querySelector('#del-img').style.display = 'none';
    document.querySelector('#del-img').addEventListener('click', del_image);
    var preview = document.querySelector('#img-div');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();
    
    reader.onloadend = function () {
        preview.style.backgroundImage = `url(${reader.result})`;
        document.querySelector('.large-popup').querySelector('#img-change').value = 'true';
    }

    if (file) {
        document.querySelector('.form-action-btns').querySelector('input[type=submit]').disabled = false;
        var promise = new Promise(function(resolve, reject){
            setTimeout(() => {
                var read = reader.readAsDataURL(file);
                resolve(read);
            },500);
        });
        promise 
            .then(function () { 
                document.querySelector('#spinner').style.display = 'none';
                document.querySelector('#del-img').style.display = 'block';
            })
            .catch(function () { 
                console.log('Some error has occured'); 
            });
        
    }
    else {
        document.querySelector('#spinner').style.display = 'none';
        document.querySelector('#del-img').style.display = 'block';
    }
}

function del_image() {
    document.querySelector('input[type=file]').value = '';
    document.querySelector('#img-div').style.backgroundImage = '';
    document.querySelector('#img-div').style.display = 'none';
    document.querySelector('.large-popup').querySelector('#img-change').value = 'true';
    if(document.querySelector('.large-popup').querySelector('#post-text').value.trim().length <= 0) {
        document.querySelector('.large-popup').querySelector('.form-action-btns').querySelector('input[type=submit]').disabled = true;
    }
}

function like_post(element) {
    if(document.querySelector('#user_is_authenticated').value === 'False') {
        login_popup('like');
        return false;
    }
    let id = element.dataset.post_id;
    fetch('/network/post/'+parseInt(id)+'/like', {
        method: 'PUT'
    })
    .then(() => {
        let count = element.querySelector('.likes_count');
        let value = count.innerHTML;
        value++;
        count.innerHTML = value;
        element.querySelector('.svg-span').innerHTML = `
            <svg width="1.1em" height="1.1em" viewBox="0 -1 16 16" class="bi bi-heart-fill" fill="#e0245e" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>`;
        element.setAttribute('onclick','unlike_post(this)');
    })
}

function unlike_post(element) {
    let id = element.dataset.post_id;
    fetch('/network/post/'+parseInt(id)+'/unlike', {
        method: 'PUT'
    })
    .then(() => {
        let count = element.querySelector('.likes_count');
        let value = count.innerHTML;
        value--;
        count.innerHTML = value;
        element.querySelector('.svg-span').innerHTML = `
            <svg width="1.1em" height="1.1em" viewBox="0 -1 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
            </svg>`;
        element.setAttribute('onclick','like_post(this)');
    })
}


function follow_user(element, username, origin) {
    if(document.querySelector('#user_is_authenticated').value === 'False') {
        login_popup('follow');
        return false;
    }
    fetch(`/network/${username}/follow`, {
        method: 'PUT'
    })
    .then(() => {
        if(origin === 'suggestion') {
            element.parentElement.innerHTML = `<button class="btn btn-success" type="button" onclick="unfollow_user(this,'${username}','suggestion')">Following</button>`;
        }

        if(document.querySelector('.body').dataset.page === 'profile') {
            if(document.querySelector('.profile-view').dataset.user === username) {
                document.querySelector('#follower__count').innerHTML++;
            }
        }
        if(document.querySelector('.body').dataset.page === 'profile') {
            if(document.querySelector('.profile-view').dataset.user === document.querySelector('#user_is_authenticated').dataset.username) {
                document.querySelector('#following__count').innerHTML++;
            }
        }
    });
}

function unfollow_user(element, username, origin) {
    if(document.querySelector('#user_is_authenticated').value === 'False') {
        login_popup('follow');
        return false;
    }
    fetch('network/'+username+'/unfollow', {
        method: 'PUT'
    })
    .then(() => {
        if(origin === 'suggestion') {
            element.parentElement.innerHTML = `<button class="btn btn-outline-success" type="button" onclick="follow_user(this,'${username}','suggestion')">Follow</button>`;
        }

        if(document.querySelector('.body').dataset.page === 'profile') {
            if(document.querySelector('.profile-view').dataset.user === username) {
                document.querySelector('#follower__count').innerHTML--;
            }
        }
        if(document.querySelector('.body').dataset.page === 'profile') {
            if(document.querySelector('.profile-view').dataset.user === document.querySelector('#user_is_authenticated').dataset.username) {
                document.querySelector('#following__count').innerHTML--;
            }
        }
    });
}


function goto_register() {
    window.location.href = '/network/register';
}

function goto_login() {
    window.location.href = '/network/login';
}
