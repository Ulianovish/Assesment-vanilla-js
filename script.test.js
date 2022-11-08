/**
 * @jest-environment jsdom
 */

// import Script from './script';
import { fireEvent } from '@testing-library/dom'
'use strict';
jest.mock('./script'); // SoundPlayer is now a mock constructor
describe('Tests', () => {
    let script;
    beforeAll(() => {
        document.body.innerHTML=`<div class="wrapper">
        <select id="select" class="main-input">
            <option value="null" disabled selected>Select an article</option>
        </select>
        <input id="isImported" value="isImported" type="checkbox" /><label class="label-1"> Is Imported</label>
    
        <input id="quantity" class="main-input number-input" type="number" placeholder="Quantity" />
        <input id="value" class="main-input number-input" type="number" placeholder="Value" />
        <button type="buttons" id="addArticle" class="main-input button">Add Article</button>
    </div> 
    <div class="wrapper">
        <button type="buttonn" id="getTotal" class="main-input button">Get Total with Taxes</button>
    </div>`;

    
    script = require('./script');
        // Script.mockClear();
    });

    it('renders the app', () => {
        expect(document.getElementsByClassName('wrapper')).not.toBeNull();
    })

    it('renders 7 articles to be selected', () => {
        expect(document.getElementById('select').length).toBe(7);
    })

    it('does not allow to add article when quantity is empty', () => {
        document.getElementById('select').value = 1
        document.getElementById('quantity').value = 1
        document.getElementById('value').value = undefined

        fireEvent.click(document.getElementById('addArticle'));

        expect(document.getElementById('articleList').getElementsByTagName('li').length).toBe(0);
    })

    it('does not allow to add article when value is empty', () => {
        document.getElementById('select').value = 1
        document.getElementById('quantity').value = undefined
        document.getElementById('value').value = 10.00

        fireEvent.click(document.getElementById('addArticle'));

        expect(document.getElementById('articleList').getElementsByTagName('li').length).toBe(0);
    })

    it('does not allow to add article when no one is selected', () => {
        document.getElementById('select').value = 'null'
        document.getElementById('quantity').value = 1
        document.getElementById('value').value = 10.00

        fireEvent.click(document.getElementById('addArticle'));

        expect(document.getElementById('articleList').getElementsByTagName('li').length).toBe(0);
    })

    it('allow to add one article when', () => {
        document.getElementById('select').value = 1;
        document.getElementById('quantity').value = 1;
        document.getElementById('value').value = 10.00;

        fireEvent.click(document.getElementById('addArticle'));

        expect(document.getElementById('articleList').getElementsByTagName('li').length).toBe(1);
    })

    it('allow to add one imported article when', () => {
        document.getElementById('select').value = 2;
        document.getElementById('quantity').value = 2;
        document.getElementById('isImported').checked = true;
        document.getElementById('value').value = 20.00;

        fireEvent.click(document.getElementById('addArticle'));

        expect(document.getElementById('articleList').getElementsByTagName('li')[1].innerHTML).toMatch('imported');
    })

    it('clean inputs after add a new article to the list', () => {
        expect(document.getElementById('select').value).toBe('null');
        expect(document.getElementById('quantity').value).toBe('');
        expect(document.getElementById('value').value).toBe('');
        expect(document.getElementById('isImported').checked).toBeFalsy;
    })

    it('calculate the total and taxes vaules when get total is clicked', () => {
        fireEvent.click(document.getElementById('getTotal'));

        console.log(document.getElementById('totalList').getElementsByTagName('li')[3].innerHTML)

        expect(document.getElementById('totalList').getElementsByTagName('li')[0].innerHTML).toMatch('11.00');
        expect(document.getElementById('totalList').getElementsByTagName('li')[1].innerHTML).toMatch('42.00');
        expect(document.getElementById('totalList').getElementsByTagName('li')[2].innerHTML).toContain('Sales Taxes: 3.00');
        expect(document.getElementById('totalList').getElementsByTagName('li')[3].innerHTML).toContain('Total: 53');
    })
});
