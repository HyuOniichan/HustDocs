'use strict'


const $ = document.querySelector.bind(document); 
const $$ = document.querySelectorAll.bind(document);

// localhost 
const port = `http://localhost:3000`; 

// database 
var docs; 

// get restApi and start app 
function getApi(endpoint) {
    fetch(`${port}/${endpoint}`)
        .then(res => res.json()) 
        .then(data => app.start(data)) 
        .catch(err => console.log(err))  
}
getApi('docs')



const app = {

    renderDocsCards(data, last = true) {
        let docsTypeList = $('#docsTypeList'); 
        docsTypeList.innerHTML = data.map(dt => {
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${dt.title}</h5>
                        <p class="card-text">${dt.content}</p>
                        <div>
                            ${(dt.links)? dt.links.map(link => `
                                <a href="${link.direct}">${link.text}</a>
                            `) : ``}
                        </div>
                        ${last? `<button class="btn btn-primary access-doc-btn" data-id="${dt.id}">Check</button>` : ``}
                    </div>
                </div>
            ` 
        }).join(''); 
        this.renderChosenDoc(); 
    }, 
    renderChosenDoc() {
        const allDocAccessBtns = $$('.access-doc-btn'); 
        allDocAccessBtns.forEach(allDocAccessBtn => {
            allDocAccessBtn.addEventListener('click', e => {
                let id = docs.findIndex(doc => doc.id == e.target.getAttribute('data-id')); 
                this.renderDocsCards(docs[id].doc, false); 
                this.renderBackBtn(); 
                this.handleCreateContent(docs[id].id); 
            })
        });
    }, 
    renderBackBtn() {
        const backBtn = $('#back'); 
        const hideAction = $('#hideAction'); 
        hideAction.classList.remove('d-none'); 
        backBtn.addEventListener('click', e => {
            hideAction.classList.add('d-none'); 
            this.renderDocsCards(docs); 
        }); 
    }, 
    renderBreadcumb() {
        // later
    }, 

    handleCreateData(createId, data) {
        const options = {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        }
        fetch(`${port}/docs/${createId}`, options)
            .then(res => res.json()) 
            .then(data => console.log(data)) 
            .catch(err => console.log(err)); 
    }, 
    handleCreateContent(createId) {
        const submitBtn = $('#submitBtn'); 
        submitBtn.addEventListener('click', e => {
            e.preventDefault(); 
            let title = $('#title').value.trim(); 
            let content = $('#content').value.trim(); 
            let linkText = $('#link-text').value.split(); 
            let linkDirect = $('#link-direct').value.split(); 

            let numberLink = linkText.length; 
            
            if (!title || !content) return; 
            if (linkText.length != linkDirect.length) return; 

            let links = []; 
            for (let i = 1; i <= numberLink; i++) {
                links.push({
                    id: `${i}`, 
                    text: linkText[i-1], 
                    direct: linkDirect[i-1]
                })
            }

            const body = {
                id: `${Date.now()}`, 
                title: title, 
                content: content, 
                links: links 
            }

            fetch(`${port}/docs/${createId}`)
                .then(res => res.json()) 
                .then(data => {
                    data.doc.push(body); 
                    this.handleCreateData(createId, data); 
                })
                .catch(err => console.log(err)); 

        })
    }, 
    
    render() {
        this.renderDocsCards(docs); 

    }, 
    handle() {
        // this.handleCreateContent();
    }, 
    start(data) {
        docs = data; 
        this.render(); 
        this.handle();  
    }
}


