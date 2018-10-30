var form = document.querySelector('form');
var output = document.querySelector('#output');
var JSONreturn;

function handleSubmit( event ) {
    event.preventDefault();
    let input = document.querySelector('#input');
    console.log( input.value );
    
    JSONreturn = evaluatePhrase( input.value );
    console.log( JSONreturn );
    
    output.innerHTML = "<b>Response:</b> " + JSONreturn.label;
}

function evaluatePhrase( phrase ) {
    console.log( phrase );
    
    var xhttp = new XMLHttpRequest()
    
    phrase = encodeURIComponent( phrase );

    // AJAX THAT SHYT
    xhttp.open("GET", "request.php?text=" + phrase  , true);
    
    console.log("request.php?text=" + phrase );
    
    xhttp.onreadystatechange = function() {
        var responseJSON;
        if ( this.readyState == 4 && this.status == 200 ) { // on success
            console.log( JSON.parse( this.response ) );
            responseJSON = JSON.parse( this.responseText );
        } else if ( this.status == 503 ) {
            responseJSON =  {
                label: 'Exceeded daily request limit.'
            };
        } else {
            responseJSON = {
                label: 'Nothing happened'
            }
        }
        /* do soomething */
        output.textContent = responseJSON.label;
    }
    
    console.log( 'loading...' );
    
    xhttp.send();
}

form.addEventListener('submit', handleSubmit);
