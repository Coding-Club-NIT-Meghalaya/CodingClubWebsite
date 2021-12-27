// function deleteMaterial(id) {
//     console.log('Fired: ' + id)
//     var result = confirm("Want to delete?");
//     if (result) {
//         fetch(event_url + id, {
//             method: 'DELETE',
//         }).then(res => {
//             window.location.reload()
//             return res.json()
//         });
//     }
// }


var webinar = '/api/v1/video/'

function deleteVideo(id) {
    console.log('Fired')
    var result = confirm("Want to delete?");
    if (result) {
        fetch(webinar + id, {
            method: 'DELETE',
        }).then(res => {
            window.location.reload()
            return res.json()
        });
    }
}
