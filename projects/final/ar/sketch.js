// create a variable to hold our world object
var world;

// create a variable to hold our marker
var marker;

function setup() {
    // create our world (this also creates a p5 canvas for us)
    world = new World('ARScene');

    // grab a reference to the marker that we set up on the HTML side (connect to it using its 'id')
    marker = world.getMarker('hiro');

    // create some geometry to add to our marker
    // the marker is 1 meter x 1 meter, with the origin at the center
    // the x-axis runs left and right
    // -0.5, 0, -0.5 is the top left corner
    var room = new Box({
        x:0, y:-0.3, z:0,
        red:180, green:180, blue:180,
        width:1, height:0.7, depth:1,
        side: 'back',
        roughness: 0
    });
    
    var overlay = new Plane({
        x: 0, y: 0, z:0,
        red: 180, green: 0, blue: 0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        rotationX: 90,
        opacity: 0.3,
        side: 'double'
    });
    
    

    marker.addChild( room );
    marker.addChild( overlay );

}


function draw() {



}
