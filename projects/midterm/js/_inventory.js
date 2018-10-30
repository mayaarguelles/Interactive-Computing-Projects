var tools = document.querySelectorAll('#toolbar div');

function Inventory( library ) {
    this.library = library;
    
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
        for ( let i = 0; i < this.items.length; i++ ) {
            if ( this.items[i].id == item.id ) {
                console.log( "found dupe!" );
                console.log( this.items[i] );
                console.log( this.items[i].quantity );
                
                this.items[i].quantity += item.quantity;
                this.displayInventory();
                
                this.updateToolbar();
                
                return;
            }
        }
        
        this.items.push( item );
        this.displayInventory();
        
        for ( let i = 0; i < this.toolbar.length; i++ ) {
            if ( this.toolbar[i].index === false ) {
                this.toolbar[i] = {
                    name: item.name,
                    index: this.items.length - 1
                };
                if ( i != 9 ) {
                    console.log( i );
                    this.changeToolbar( i + 1, item);
                } else {
                    this.changeToolbar( 0, item );
                }
                
                break;
            }
        }
    }
    
    this.removeItem = function( item, index = false ) {
        if ( index !== false ) {
            if ( index < 0 || index >= this.items.length ) {
                return false;
            }
            this.items.splice( index, 1 );
            this.displayInventory();
            return true;
        }
        
        // you need to put the other behavior here!!!!
        
        this.displayInventory();
        return true;
    }
    
    this.updateHeld = function( index ) {
        for ( let i = 0; i < tools.length; i++ ) {
            tools[i].classList.remove('active');
        }
        this.cur = index;
        
        let newActive = document.querySelector('#tool-' + index );
        newActive.classList.add('active');
        
        if ( index != 0 ) {
            return this.toolbar[ ( parseInt(index) - 1 ) % 10 ].name;
        } else {
            return this.toolbar[9].name;
        }
        
        
    }

    
    this.changeToolbar = function( index, item ) {
        
        console.log( index);
        let changing = document.querySelector('#tool-' + index);
        let changingIMG = document.querySelector('#tool-' + index + ' img');
        
        changing.setAttribute( 'data-label', item.label );
        changing.setAttribute( 'data-name', item.name );
        changing.setAttribute( 'data-quantity', item.quantity );
        
        if ( item.name != -1 ) {
            changingIMG.src = ( 'assets/items/' + item.name + '.png' );
        } else {
            changingIMG.src = "assets/items/none.png";
        }
        
    }
    
    this.updateToolbar = function() {
        for ( let i = 0; i < this.toolbar.length; i++ ) {
            let index = i + 1;
            if ( index == 10 ) {
                index = 0;
            }
            
            console.log( 'index: ' + index );
            
            let toShow = this.toolbar[i];
            
            if ( toShow.index !== false ) {
                let changing = document.querySelector('#tool-' + index);
                let changingIMG = document.querySelector('#tool-' + index + ' img');

                console.log( toShow );

                changing.setAttribute( 'data-label', this.items[ toShow.index ].label );
                changing.setAttribute( 'data-name', this.items[ toShow.index ].name );
                changing.setAttribute( 'data-quantity', this.items[ toShow.index ].quantity );

                if ( this.items[ toShow.index ].name != -1 ) {
                    changingIMG.src = ( 'assets/items/' + this.items[ toShow.index ].name + '.png' );
                } else {
                    changingIMG.src = "assets/items/none.png";
                }
            } else {
                let changing = document.querySelector('#tool-' + index);
                let changingIMG = document.querySelector('#tool-' + index + ' img');
                
                changing.setAttribute( 'data-label', "" );
                changing.setAttribute( 'data-name', "" );
                changing.setAttribute( 'data-quantity', "" );
                
                changingIMG.src = "assets/items/none.png";
            }
            
            
            
        }
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
                
                list += " x " + this.items[i].quantity;
                
                list += "</li>";
            }
            list += "</ul>";
            inventoryDOM.innerHTML = list;
        }
    }
    
    this.sell = function( index, cur ) {
        this.items[index].quantity--;
        let worth = this.items[index].value;
        if ( this.items[index].quantity == 0 ) {
            this.removeItem(false, index);
            console.log( cur );
            this.toolbar[cur] = {
                name: "-1",
                index: false
            };
        }
        
        return worth;
    }
}