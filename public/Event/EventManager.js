function myfun(href) {
    location.replace("/admin/event_manager/" + href);
}


var event_url = '/api/v1/event/'

function deleteEvent(id) {
    console.log('Fired: ' + id)
    var result = confirm("Want to delete?");
    if (result) {
        fetch(event_url + id, {
            method: 'DELETE',
        }).then(res => {
            window.location.reload()
            return res.json()
        });
    }
}

var webinar = '/api/v1/webinar/'

function deleteWebinar(id) {
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

var programming = '/api/v1/programming/'

function deleteProgramming(id) {
    console.log('Fired')
    var result = confirm("Want to delete?");
    if (result) {
        fetch(programming + id, {
            method: 'DELETE',
        }).then(res => {
            window.location.reload()
            return res.json()
        });
    }
}

var achievement = '/api/v1/achievement/'

function deleteAchievement(id) {
    console.log('Fired')
    var result = confirm("Want to delete?");
    if (result) {
        fetch(achievement + id, {
            method: 'DELETE',
        }).then(res => {
            window.location.reload()
            return res.json()
        });
    }
}