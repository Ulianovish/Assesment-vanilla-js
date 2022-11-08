import data from './data.json'  assert {type: 'json'};

console.log(data)

class CalculatorTax {

    receipt = [];
    constructor() {
        this.createList();
        this.fillArticlesList();
        this.addArticle();
        this.getTotal();
        console.log(this.array)
    }

    createList() {
        var ul = document.createElement('ul');
        ul.classList.add('list');
        ul.setAttribute('id', 'articleList');
        document.getElementsByClassName('wrapper')[0].appendChild(ul);

        var ul2 = document.createElement('ul');
        ul2.classList.add('list');
        ul2.setAttribute('id', 'totalList');
        document.getElementsByClassName('wrapper')[1].appendChild(ul2);

    }
    
    fillArticlesList() {
        var select = document.getElementById('select'),
            option,
            i = 0,
            il = data.articles.length;
    
        var index = 0;
        for (; i < il; i += 1) {
            option = document.createElement('option');
            option.setAttribute('value', i);
            option.appendChild(document.createTextNode(data.articles[i].name));
            select.appendChild(option);
        }
    }

    addArticle() {
        let quantity = document.getElementById("quantity");
        let select = document.getElementById("select");
        let value = document.getElementById("value");
        let isImported = document.getElementById("isImported");

        document.addEventListener('click', (event) => {
            if (event.target.id != 'addArticle') return;
            event.preventDefault();

            if(!!Number(quantity.value) && !!Number(value.value) && select.value != 'null') {
                let article = '';
                article += `${quantity.value} `;
                article += isImported.checked ? 'imported ' : '';
                article += `${data.articles[select.value].name } `;
                article += `at ${value.value}`;
                this.receipt.push({
                    "name": data.articles[select.value].name,
                    "quantity": quantity.value,
                    "isImported": isImported.checked,
                    "total": quantity.value*value.value,
                    "totalWithTaxes": ((quantity.value*value.value)*(data.articles[select.value].hasBasicTax && isImported.checked ? 1.15 : data.articles[select.value].hasBasicTax ? 1.1 : isImported.checked ? 1.05 : 1)).toFixed(2),
                })
                select.value = 'null';
                quantity.value = '';
                value.value = '';
                isImported.checked = false;
                this.printArticle(article);

            }        
        }, false);
    }

    getTotal() {
        document.addEventListener('click', (event) => {
            if (event.target.id != 'getTotal') return;
            event.preventDefault();

            if(this.receipt.length > 0) {                
                let total = 0
                let totalWithTaxes = 0
                this.receipt.forEach(item => {
                    let str = ''
                    str += `${item.quantity} `,
                    str += item.isImported ? 'imported ' : '';
                    str += `${item.name}: `
                    str += item.totalWithTaxes
                    this.printTotal(str);
                    total += Number(item.total);
                    totalWithTaxes += Number(item.totalWithTaxes)
                })

                this.printTotal(`Sales Taxes: ${(Math.ceil((totalWithTaxes-total)*20)/20).toFixed(2)}`);
                this.printTotal(`Total: ${totalWithTaxes}`);
            }        
        }, false);
    }

    printArticle(str) {
        var li = document.createElement('li');
        li.classList.add('list__entry');
        li.innerHTML = str;
        articleList.appendChild(li);
    }

    printTotal(str) {
        var li = document.createElement('li');
        li.classList.add('list__entry');
        li.innerHTML = str;
        totalList.appendChild(li);
    }
}

const calculator = new CalculatorTax()

