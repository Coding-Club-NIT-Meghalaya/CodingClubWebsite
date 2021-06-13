var example = document.querySelector('#example');
// console.log(example);  
var editor = new FroalaEditor(example, {
    imageUploadURL: "https://codingclubnitm.herokuapp.com/api/v1/image_upload",
    videoUpload: false,
    fileUpload: false,
    pastePlain: true,
    placeholderText: 'Write Your Blog here....',
    attribution: false,
    htmlExecuteScripts: true,
    spellcheck: true,
    emoticonsUseImage: false,
    toolbarButtons: {
        'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
        },
        'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
        },
        'moreRich': {
            'buttons': ['insertLink', 'insertCode', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
        },
        'moreMisc': {
            'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
            'align': 'right',
            'buttonsVisible': 2
        }
    },
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
            xhttp.open("DELETE", "https://codingclubnitm.herokuapp.com/api/v1/image/del/" + filename, true);
            xhttp.send(JSON.stringify({
                src: $img.attr('src')
            }));
        }
    },
    height: 1000,
});