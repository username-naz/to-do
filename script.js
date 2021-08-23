//initialisation
const firstTime = false;
window.onload = ()=>{
    if(firstTime===true)
        createListItem({
            subject: 'Welcome new user!',
            description: `This is your to-do list handler.</br>
            Here's how to use it: </br>
            1. To add a new list click on the circular button on your screen.</br>
            2. To edit or remove an list, move over it with your mouse or click on it if you are on your phone.</br>
            That's about it! Have fun!`
        });
    else
        loadItems();
};


//tempStorage
let items = [
    {
        id:0,
        subject:"hi",
        description:"hi guys"
    },
    {   
        id:1,
        subject:"leto",
        description:"leohjs guys"
    },
    {   id:2,
        subject:"suii",
        description:"seuihi guys"
    },   
    {   id:3,
        subject:"heya",
        description:"heya guys"
    },

];

const getNewId = ()=>{
    let newId = 0;
    items.forEach((item)=>{
        newId = Math.max(newId, item.id + 1);
    })
    return newId;
};

//List Items
document.querySelector('.create-item')
    .addEventListener('click', (e)=>{
        e.preventDefault();
        document.querySelector('.create-item-form').style.display = 'block';
    });

const loadItems = () =>{
    const listBox = document.getElementsByClassName('list-box')[0];
    listBox.innerHTML = "";
    items.forEach((item)=>{
        createListItem(item);
    });

    document.querySelector('.empty-list-message')
        .style.display = items.length===0?'block':'none';
        
}

const createListItem = (item)=>{
    const listBox = document.getElementsByClassName('list-box')[0];

    const listItem = document.createElement('div');
    listItem.setAttribute('class', 'list-item');

    const subject = document.createElement('h4');
    subject.innerHTML = item.subject;
    subject.setAttribute('class', 'subject')
    listItem.appendChild(subject);

    const description = document.createElement('p');
    description.innerHTML = item.description;
    description.setAttribute('class', 'description');
    description.style.width = '70%';
    listItem.appendChild(description);

    const editButton = document.createElement('button');
    const editImg = document.createElement('img');
    editButton.setAttribute('class', 'edit-button');
    editImg.setAttribute('src', 'res/images/pen.png');
    editButton.appendChild(editImg);
    listItem.appendChild(editButton);

    const removeButton = document.createElement('button');
    const removeImg = document.createElement('img');
    removeButton.setAttribute('class', 'remove-button');
    removeImg.setAttribute('src', 'res/images/x.png');
    removeButton.appendChild(removeImg);
    listItem.appendChild(removeButton);
    //functionality
    removeButton.addEventListener('click', (e)=>{
        items = items.filter((i)=>i.id!==item.id);
        loadItems();
    });
    
    listBox.appendChild(listItem);



};




//form

document.querySelector('.add-item')
    .addEventListener('click', (e)=>{
        e.preventDefault();
        const subjectField = document.querySelector('input[name=subject]');
        const descriptionField = document.querySelector('textarea[name=description]');
        const subject = subjectField.value;
        const description = descriptionField.value;

        if(subject && description){
            e.target.parentElement.reset();
            items.push({id:getNewId(),subject:subject, description:description});
            loadItems();
            document.querySelector('.create-item-form').style.display = 'none';
        }
    });

document.querySelector('.cancel')
.addEventListener('click', (e)=>{
    e.preventDefault();
    e.target.parentElement.reset();
    document.querySelector('.create-item-form').style.display = 'none';
});


