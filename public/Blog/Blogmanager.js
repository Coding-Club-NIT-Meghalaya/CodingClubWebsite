var url = 'https://codingclubnitm.herokuapp.com/api/v1/blog/'
var deleteblog = document.querySelector('#delete');

function deleteblog(id) {
    console.log('Fired')
    fetch(url + id, {
        method: 'DELETE',
    }).then(res => {
        window.location.reload()
        return res.json()
    });
}