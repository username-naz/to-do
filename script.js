
/* ///////
    INITIALISATION
///////
*/

let items = [];
const filters = Object.freeze({
    VIEW_ALL:'VIEW_ALL', 
    UNDONE_ONLY:'UNDONE_ONLY',
    DONE_ONLY:'DONE_ONLY'
});
let filter = filters.VIEW_ALL;

window.onload = ()=>{
    const visited = localStorage.getItem('visited');
    if(!visited){
        createListItem({
            subject: 'Welcome new user!',
            description: `This is your to-do list handler.
            Here's how to use it:   
            1. To add a new to-do, click on the circular button on your screen.
            2. To edit or remove a to-do, move over it with your mouse and click on the required button.
            3. You can mark a to-do as done with the check-marked button. You can edit it to be active again.
            That's about it. Have fun!`
        }); 
        localStorage.setItem('visited', true);
    }
    else{
        items = JSON.parse(localStorage.getItem('items'));
        if(!items)
            items = [];
        loadItems({preventStorageUpdate : true});
    }
};

let editing = {status : false, item : null};


/* ///////
    TEMP STORAGE
///////
*/


const getNewId = ()=>{
    let newId = 0;
    items.forEach((item)=>{
        newId = Math.max(newId, item.id + 1);
    })
    return newId;
};


/* ///////
    LIST ITEMS
///////
*/
document.querySelector('.create-item')
    .addEventListener('click', (e)=>{
        e.preventDefault();
        openForm();
    });

const loadItems = ({preventStorageUpdate = false} = {}) =>{
    let displayableItems = [];
    items.forEach((item=>{
        if(filter===filters.VIEW_ALL) displayableItems.push(item);
        else if((filter===filters.UNDONE_ONLY) && !item.isDone) displayableItems.push(item);
        else if((filter===filters.DONE_ONLY) && item.isDone) displayableItems.push(item);
    }));

    if(!preventStorageUpdate)
        updateStorage();

    const listBox = document.getElementsByClassName('list-box')[0];
    listBox.innerHTML = "";
    displayableItems.forEach((item)=>{
        createListItem(item);
    });

    document.querySelector('.empty-list-message')
        .style.display = items.length===0?'block':'none';
        
}

const updateStorage = ()=>{
    localStorage.setItem('items', JSON.stringify(items));
}

const createListItem = (item)=>{
    const listBox = document.getElementsByClassName('list-box')[0];

    //the item
    const listItem = document.createElement('div');
    listItem.setAttribute('class', 'list-item');
    listItem.setAttribute('id', item.id);
    //subject
    const subject = document.createElement('h4');
    subject.innerText = item.subject;
    subject.setAttribute('class', 'subject')
    listItem.appendChild(subject);
    //description
    const description = document.createElement('p');
    description.innerText = item.description;
    description.setAttribute('class', 'description');
    listItem.appendChild(description);

    //Remove button
    const removeButton = document.createElement('button');
    const removeImg = document.createElement('img');
    removeButton.setAttribute('class', 'remove-button');
    removeImg.setAttribute('src', 'res/images/x.png');
    removeButton.appendChild(removeImg);
    listItem.appendChild(removeButton);
    //functionality
    removeButton.addEventListener('click', (e)=>{
        items = items.filter((i)=>i.id!=e.target.parentElement.getAttribute('id'));
        loadItems();
    });

    
    //edit Button
    const editButton = document.createElement('button');
    const editImg = document.createElement('img');
    editButton.setAttribute('class', 'edit-button');
    editImg.setAttribute('src', 'res/images/pen.png');
    editButton.appendChild(editImg);
    listItem.appendChild(editButton);
    //functionality
    editButton.addEventListener('click', (e)=>{
        editing.status = true;
        editing.item = items.find((i)=> i.id == e.target.parentElement.getAttribute('id'));
        openForm();
    });
    
    //done Button
    if(!item.isDone){
        const doneButton = document.createElement('button');
        const doneImg = document.createElement('img');
        doneButton.setAttribute('class', 'done-button');
        doneImg.setAttribute('src', 'res/images/tick.png');
        doneButton.appendChild(doneImg);
        listItem.appendChild(doneButton);
        //functionality
        doneButton.addEventListener('click', (e)=>{
            items[parseInt(e.target.parentElement.getAttribute('id'))].isDone = true;
            loadItems();
        });
    }
    else{
        subject.style.opacity = 0.5;
        description.style.opacity = 0.5;
    }
    
    listBox.appendChild(listItem);
};





/* ///////
    FORM
///////
*/

const subjectField = document.querySelector('input[name=subject]');
const descriptionField = document.querySelector('textarea[name=description]');
const isDoneCheckBox = document.querySelector('input[name=is-done]');

document.querySelector('.add-item')
    .addEventListener('click', (e)=>{
        e.preventDefault();
        const subject = subjectField.value;
        const description = descriptionField.value;
        const isDone = isDoneCheckBox.checked;

        if(subject && description){
            items.push({id:getNewId(),subject:subject, description:description, isDone:isDone});
            loadItems();
            closeForm();
        }
    });

document.querySelector('.edit-item')
    .addEventListener('click', (e) =>{
        e.preventDefault();
        const subject = subjectField.value;
        const description = descriptionField.value;
        const isDone = isDoneCheckBox.checked;
        
    if(subject && description){
        items.forEach((i)=>{
            if(i.id == editing.item.id){
                i.subject = subject;
                i.description = description;
                i.isDone = isDone;
            }
        });
        editing.status = false;
        editing.item = null;
        loadItems();
        closeForm();
    }
});

document.querySelector('.cancel')
.addEventListener('click', (e)=>{
    e.preventDefault();
    editing.status = false;
    editing.item = null;
    closeForm();
});

const openForm = ()=>{
    document.querySelector('.create-item-form').style.display = 'block';
    if(editing.status==true){
        subjectField.value = editing.item.subject;
        descriptionField.value = editing.item.description;
        isDoneCheckBox.checked = editing.item.isDone;
        document.querySelector('.add-item').style.display = 'none';
        document.querySelector('.edit-item').style.display = 'inline-block';
    }
    else{
        document.querySelector('.add-item').style.display = 'inline-block';
        document.querySelector('.edit-item').style.display = 'none';
    }
}

const closeForm = ()=>{
    document.querySelector('.create-item-form form').reset();
    document.querySelector('.create-item-form').style.display = 'none';
}



//settings
let settingsOpen = false;
const settings = document.querySelector('.settings');

document.querySelector('.settings-button').addEventListener('click', ()=>{ 
    settings.style.display = settingsOpen?'none':'block';
    settingsOpen = !settingsOpen;
});

//filtering
const viewAll = document.getElementsByClassName('filter-button')[0];
const UndoneOnly = document.getElementsByClassName('filter-button')[1];
const DoneOnly = document.getElementsByClassName('filter-button')[2];

viewAll.style.background = "#cccccc";


viewAll.addEventListener('click', ()=>{
    viewAll.style.background = "#cccccc";
    UndoneOnly.style.background = "#e6e6e6";
    DoneOnly.style.background = "#e6e6e6";

    filter = filters.VIEW_ALL;
    loadItems();
});

UndoneOnly.addEventListener('click', ()=>{
    viewAll.style.background = "#e6e6e6";
    UndoneOnly.style.background = "#cccccc";
    DoneOnly.style.background = "#e6e6e6";

    filter = filters.UNDONE_ONLY;
    loadItems();
});

DoneOnly.addEventListener('click', ()=>{
    viewAll.style.background = "#e6e6e6";
    UndoneOnly.style.background = "#e6e6e6";
    DoneOnly.style.background = "#cccccc";

    filter = filters.DONE_ONLY;
    loadItems();
});