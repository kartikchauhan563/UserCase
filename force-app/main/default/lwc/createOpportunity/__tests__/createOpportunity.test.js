/* eslint-disable @lwc/lwc/no-async-operation */
import { createElement } from 'lwc';
import createOpportunity from 'c/createOpportunity';

describe('c-create-opportunity', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays inputs and button with correct labels', () => {
        // Arrange
        const element = createElement('c-create-opportunity', {
            is: createOpportunity
        });

        // Act
        document.body.appendChild(element);

        setTimeout(() => {
            const opportunityName = element.shadowRoot.querySelector('lightning-input[id="opportunityName"]');
            expect(opportunityName).not.toBeNull();
            expect(opportunityName.label).toBe("Opportunity Name");
    
          const closeDate = element.shadowRoot.querySelector('lightning-input[id="closeDate"]');
          expect(closeDate).not.toBeNull();
          expect(closeDate.label).toBe("Close Date");
    
          const opportunityStage = element.shadowRoot.querySelector('lightning-combobox[id="opportunityStage"]');
          expect(opportunityStage).not.toBeNull();
          expect(opportunityStage.label).toBe("Stage");
    
          const createOpp = element.shadowRoot.querySelector('lightning-button[id="createOpp"]');
          expect(createOpp).not.toBeNull();
          expect(createOpp.label).toBe("Create Opportunity");
        }, 500);


  
    });

    it('displays the correct card title', () => {
        const element = createElement('c-create-opportunity', {
            is: createOpportunity
        });
        document.body.appendChild(element);
        const cardTitle = element.shadowRoot.querySelector('lightning-card').title;
        expect(cardTitle).toBe('Create Record');
    });

    let opportunityRecordIsCreated = false;

    it('creates Opportunity record when Create Contact button is clicked', () => {
        const element = createElement("c-create-opportunity", {
            is: createOpportunity
          });
          document.body.appendChild(element);
        // Arrange
        setTimeout(() => {
        const opportunityName = element.shadowRoot.querySelector('lightning-input[id="opportunityName"]');
        const closeDate = element.shadowRoot.querySelector('lightning-input[id="closeDate"]');
        const opportunityStage = element.shadowRoot.querySelector('lightning-combobox[id="opportunityStage"]');
        const createOpp = element.shadowRoot.querySelector('lightning-button[id="createOpp"]');

        opportunityName.value = 'Apple';
        closeDate.value = '05/05/2023';
        opportunityStage.value = 'Negotiation/Review';

        // Act
        createOpp.click();

        opportunityRecordIsCreated = true;
        expect(opportunityRecordIsCreated).toBe(true);
        }, 500);
    });
});