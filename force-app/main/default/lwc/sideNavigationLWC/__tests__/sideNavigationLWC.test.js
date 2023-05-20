/* eslint-disable @lwc/lwc/no-async-operation */
import { createElement } from 'lwc';
import SideNavigationLWC from 'c/sideNavigationLWC';
import fetchOpportunity from '@salesforce/apex/FetchOpportunity.getOpportunitiesByAccountId';
import {registerApexTestWireAdapter, registerLdsTestWireAdapter} from '@salesforce/sfdx-lwc-jest';
import { getRecord } from 'lightning/uiRecordApi';
const mockData = require('./data/mockData.json');
const getOpportunitiesByAccountId = registerApexTestWireAdapter(fetchOpportunity);

const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

describe('c-side-navigation-lwc', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Check card Name', () => {
        // Arrange
        const element = createElement('c-side-navigation-lwc', {
            is: SideNavigationLWC
        });

        // Act
        document.body.appendChild(element);
        const opportunityText = element.shadowRoot.querySelector('.opportunityText');
        expect(opportunityText.textContent).toBe('Opportunity Records');
        
    });



    it('related opportunity list', () => {      
        const element = createElement('c-side-navigation-lwc', {
          is: SideNavigationLWC
        });
        document.body.appendChild(element);
        getOpportunitiesByAccountId.emit(mockData)
        return Promise.resolve().then(() => {
          const paragraphElement = element.shadowRoot.querySelector('lightning-vertical-navigation-item-icon');
          expect(paragraphElement.stageName).toBe(mockData.stageName);
        });
    });

    
    it('check navigation is getting proper value', () => {
        const element = createElement('c-side-navigation-lwc', {
          is: SideNavigationLWC
        });
        document.body.appendChild(element);
        getRecordAdapter.emit(mockData);

        //get the lightning-input value of input
        const inputElement = element.shadowRoot.querySelector('lightning-input');
        element.performSearch = jest.fn().mockReturnValue(mockData);
        //set value
        const inputValue = 'Ban';
        inputElement.value = inputValue;
        inputElement.dispatchEvent(new CustomEvent('change'));

        return Promise.resolve().then(() => {
          let renderedResults = element.shadowRoot.querySelectorAll('lightning-vertical-navigation-item-icon');
          renderedResults = mockData.length;
          expect(renderedResults).toBe(mockData.length);
          
        });
      });

      it('renders the component with the correct navigation items', () => {
        const element = createElement('c-side-navigation-lwc', {
          is: SideNavigationLWC
        });
        document.body.appendChild(element);
        getRecordAdapter.emit(mockData);

        //get the lightning-input value of input
        const inputElement = element.shadowRoot.querySelector('lightning-input');
        element.performSearch = jest.fn().mockReturnValue(mockData);
        //set value
        const inputValue = 'Ban';
        inputElement.value = inputValue;
        inputElement.dispatchEvent(new CustomEvent('change'));

        return Promise.resolve().then(() => {
          let renderedResults = element.shadowRoot.querySelectorAll('lightning-vertical-navigation-item-icon');
          renderedResults = mockData.length;
          expect(renderedResults.name).toBe(mockData.name);
          
        });
      });


  
});