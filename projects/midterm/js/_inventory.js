var tools = document.querySelectorAll('#toolbar div');

function Inventory() {
    this.toolbar = [
        {
            name: -1,
            index: false
        },
        {
            name: -1,
            index: false
        },
        {
            name: -1,
            index: false
        },
        {
            name: -1,
            index: false
        },
        {
            name: -1,
            index: false
        },
        {
            name: -1,
            index: false
        },
        {
            name: -1,
            index: false
        },
        {
            name: -1,
            index: false
        },
        {
            name: -1,
            index: false
        },
        {
            name: -1,
            index: false
        }
    ];
    
    this.cur = 1;
    
    this.items = [];
    
    this.addItem = function( item ) {
        this.items.push( item );
    }
    
    this.removeItem = function( item, index = false ) {
        if ( index !== false ) {
            if ( index < 0 || index >= this.items.length ) {
                return false;
            }
            this.items.splice( index, 1 );
            return true;
        }
        
        return true;
    }
    
    this.updateHeld = function( index ) {
        for ( let i = 0; i < tools.length; i++ ) {
            tools[i].classList.remove('active');
        }
        this.cur = index;
        
        let newActive = document.querySelector('#tool-' + index );
        newActive.classList.add('active');
        
        return this.toolbar[ index ].name;
    }
    
    this.displayInventory = function() {
        let inventoryDOM = document.querySelector('#inventorylist');
        
        if ( this.items.length == 0 ) {
            inventoryDOM.innerHTML = "<span class='empty'>Your inventory is empty.</span>";
        } else {
            let list = "<ul>";
            for ( let i = 0; i < this.items.length; i++ ) {
                list += "<li ";
                
                list += "data-name='" + this.items[i].name + "' ";
                list += "data-quantity='" + this.items[i].quantity + "'>";
                
                list += this.items[i].label;
                
                list += "</li>";
            }
            list += "</ul>";
            inventoryDOM.innerHTML = list;
        }
    }
}