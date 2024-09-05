'use strict'


const $ = document.querySelector.bind(document); 
const $$ = document.querySelectorAll.bind(document);

// database 
var docs; 

// get restApi and start app 
function getApi(endpoint) {
    fetch(`http://localhost:3000/${endpoint}`)
        .then(res => res.json()) 
        .then(data => app.start(data)) 
        .catch(err => console.log(err))  
}
getApi('docs')



const app = {

    renderDocsCards(data, last = true) {
        let docsTypeList = $('#docsTypeList'); 
        console.log(docsTypeList); 
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
            })
        });
    }, 
    renderBackBtn() {
        const backBtn = $('#back'); 
        backBtn.classList.remove('d-none'); 
        backBtn.addEventListener('click', e => {
            backBtn.classList.add('d-none'); 
            this.renderDocsCards(docs); 
        }); 
    }, 
    renderBreadcumb() {
        // later
    }, 
    
    render() {
        this.renderDocsCards(docs); 

    }, 
    func() {

    }, 
    start(data) {
        docs = data; 
        this.render(); 
        this.func();  
    }
}


