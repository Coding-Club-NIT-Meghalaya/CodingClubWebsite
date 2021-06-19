var url = 'https://codingclubnitm.herokuapp.com/api/v1/teammember/'

function deleteteam(id) {
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