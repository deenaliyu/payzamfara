
        document.querySelector('.hove').addEventListener('mouseover', function(e){
                alert("jy")
                let el_link = document.querySelector('.dropi');
                el_link.style.visibility = "visible";
                
    
            });

            document.querySelector('.hove').addEventListener('mouseleave', function(e){
                let el_link = this.querySelector('.dropi');
    
                el_link.classList.add('dropi')
    
    
            });
        
    

