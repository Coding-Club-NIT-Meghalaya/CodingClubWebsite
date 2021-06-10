var example = document.querySelector('#example');
// console.log(example);
var editor = new FroalaEditor(example, {
    imageUploadURL: "http://localhost:8000/api/v1/image_upload",
    videoUpload: false,
    fileUpload: false,
    events: {
        'image.removed': function($img) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {

                // Image was removed.
                if (this.readyState == 4 && this.status == 200) {
                    console.log('image was deleted');
                }
            };
            var url = $img.attr('src');
            var filename = url.substring(url.lastIndexOf('/') + 1)
            xhttp.open("DELETE", "http://localhost:8000/api/v1/image/del/" + filename, true);
            xhttp.send(JSON.stringify({
                src: $img.attr('src')
            }));
        }
    },
    height: 1000,
});