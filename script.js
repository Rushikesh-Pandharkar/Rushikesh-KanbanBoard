//1. show and hide modal on click of button
// figure out where to add event listener and what is the event. 
    // add event listener on plus button and the event is of click

    let addbtn = document.querySelector('.add-btn');
    let modalCont = document.querySelector('.modal-cont');
    let isModalHidden = true;
    
    let deletebtn=document.querySelector('.remove-btn');
    isdeleteActive=false;
    
    let textArea=document.querySelector('.textarea');
    
    let mainCont=document.querySelector('.main-cont')
    
    //Array for the reference of the cyclic click function
    let color = ['red','gold','pink','green']
    
    //storing the data of the ticket in the form of object
    let ticketArr = []
    
    //creating tickets from the local storage 
    if(localStorage.getItem('TaskArray')){
        let ticketArrStr = localStorage.getItem("TaskArray")
        ticketArr=JSON.parse(ticketArrStr)
        for(let i= 0;i<ticketArr.length;i++){
            let ticket = ticketArr[i];
            createTicket(ticket.value,ticket.color,ticket.id)
        }
    }
    
    //Random id generation
    var uid = new ShortUniqueId();
    
    // on click of add button make modal container visible 
    addbtn.addEventListener('click',function(){
        if(isModalHidden){
            modalCont.style.display='flex';
            isModalHidden=false;
        }else{
            modalCont.style.display='none'
            isModalHidden=true;
        }
    } )
    
    //2. On click of delete btn make it red if again clicked make it black
    
    deletebtn.addEventListener('click',function(){
        if(isdeleteActive){
            deletebtn.style.color='black';
            isdeleteActive=false;
        }else{
            deletebtn.style.color='red';
            isdeleteActive=true;
        }
    })
    
    //3. Crate the ticket after the enter is pressed on the textarea
    
    let allPriorityColor = document.querySelectorAll('.priority-color')
    let priorityColor = 'red';
    for(let i=0;i<allPriorityColor.length;i++){
        allPriorityColor[i].addEventListener('click',function(){
            // console.log(allPriorityColor[i].classList[1]);
            
            for(let j=0;j<allPriorityColor.length;j++){
                allPriorityColor[j].classList.remove('active');
            }
    
            allPriorityColor[i].classList.add('active');
            priorityColor = allPriorityColor[i].classList[1];
            // console.log(priorityColor);
        })
    }
    
    textArea.addEventListener('keydown',function(e){
        let key=e.key;
        if(key == 'Enter'){
            let task=textArea.value;
            
            createTicket(task,priorityColor);
            //Hide the modal
            modalCont.style.display='none'
            isModalHidden=true;
            //Empty the textarea
            textArea.value="";
        }
    })
    
    function createTicket(task,priorityColor,ticketId){
        //crate the below structure with js and add it to main container
        // <div class="ticket-cont">
        //     <div class="ticket-color"></div>
        //     <div class="ticket-id">#5gf832</div>
        //     <div class="ticket-area">Some task</div>
        // </div>
        let id ;
        if(ticketId){//id is there means we are creating from local storage
            id=ticketId
        }else{//else we are creating from UI
            id = uid.rnd();
        }
        
        let ticketCont=document.createElement('div');
        ticketCont.className='ticket-cont';
        ticketCont.innerHTML=`<div class="ticket-color ${priorityColor}"></div>
                            <div class="ticket-id">#${id}</div>
                            <div class="ticket-area">${task}</div>
                            <div class="lock-unlock-btn">
                                <i class="fa-solid fa-lock"></i>
                            </div>`
        if(!ticketId){ //only make changes in the arrray in local storage when ticketId id not passed
            ticketArr.push({id:id,color:priorityColor,value:task});
            // console.log(ticketArr)
            let ticketArrStr = JSON.stringify(ticketArr) 
            localStorage.setItem("TaskArray",ticketArrStr)
        }
        mainCont.appendChild(ticketCont);
    
        // handle delete ticket 
        ticketCont.addEventListener('click',function(){
            if(isdeleteActive){
                ticketCont.remove();
                let ticketIndex = ticketArr.findIndex(function(ticketObj){
                    return ticketObj.id ==  id;
                })
                ticketArr.splice(ticketIndex,1);
                updateLocalStorage();
            }
        })
    
    
        //lock and unlock functionality text area editable
    
        let lockUnlockBtn = ticketCont.querySelector('.lock-unlock-btn i')
        let ticketArea = ticketCont.querySelector('.ticket-area')
        // console.log(lockUnlockBtn);
        lockUnlockBtn.addEventListener('click',function(e){
            // console.log(e)
            if(e.target.classList.contains('fa-lock')){
                e.target.classList.remove('fa-lock')
                e.target.classList.add('fa-lock-open')
                ticketArea.setAttribute('contenteditable','true');
            }else{
                e.target.classList.remove('fa-lock-open')
                e.target.classList.add('fa-lock')
                ticketArea.setAttribute('contenteditable','false');
            }
    
            let ticketIndex = ticketArr.findIndex(function(ticketObj){
                return ticketObj.id ==  id;
            })
            ticketArr[ticketIndex].value = ticketArea.innerText;
            updateLocalStorage();
        })
    
        //cyclic change function of the tickets
        let ticketColor = ticketCont.querySelector('.ticket-color')
        ticketColor.addEventListener('click',function(){
            // console.log(ticketColor)
            let currColor = ticketColor.classList[1]
            let currindex=color.findIndex(function(col){
                return col == currColor;
            })
            let nextIndx = (currindex+1)%color.length;
            let nextColor= color[nextIndx]
            ticketColor.classList.remove(currColor)
            ticketColor.classList.add(nextColor)
    
            let ticketIndex = ticketArr.findIndex(function(ticketObj){
                return ticketObj.id == id;
            })
    
            ticketArr[ticketIndex].color = nextColor;
            updateLocalStorage();
        })
    }
    
    function updateLocalStorage() {
        let ticketArrStr = JSON.stringify(ticketArr);
        localStorage.setItem("TaskArray",ticketArrStr);
    
    }
    
    // filtering the task on the basis of the color 
    let filterColor = document.querySelectorAll('.color');
    for(let i=0;i<filterColor.length;i++){
        let allTicketColor = document.querySelectorAll('.ticket-color');
        filterColor[i].addEventListener('click',function(){
            
            // console.log(filterColor[i].classList[1]);
            let SelectedfilterColor = filterColor[i].classList[1];
            for (let j = 0; j < allTicketColor.length; j++) {
                // console.log(allTicketColor[j]);
                let currentTicketColor = allTicketColor[j].classList[1];
                if(SelectedfilterColor == currentTicketColor){
                    allTicketColor[j].parentElement.style.display = 'block'
                }else{
                    allTicketColor[j].parentElement.style.display = 'none'
                }
            }
        })
    
        filterColor[i].addEventListener('dblclick',function(){
            // console.log(filterColor[i].classList[1]);
            for(let j=0;j<allTicketColor.length;j++){
                allTicketColor[j].parentElement.style.display = 'block'
            }
        })
    }