var url = '/api/v1/blog/'

function deleteblog(id) {
    console.log('Fired')
    var result = confirm("Want to delete?");
    if (result) {
        fetch(url + id, {
            method: 'DELETE',
        }).then(res => {
            window.location.reload()
            return res.json()
        });
    }

}

function makepublished(id) {
    console.log("Fired: " + id);
    let route = "/api/v1/updateblog/" + id;
    fetch(route, {
        method: 'PATCH',
    }).then(res => {
        window.location.reload()
        return res.json()
    });
}