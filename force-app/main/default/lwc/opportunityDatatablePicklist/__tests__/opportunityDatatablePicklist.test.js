/* eslint-disable import/default */
/* eslint-disable @lwc/lwc/no-async-operation */
import { createElement } from 'lwc';
import oppdata from 'c/opportunityDatatablePicklist';
import mockDataTableData from './mockData';



describe('c-opportunity-datatable-picklist', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays the correct card title', () => {
        const element = createElement('c-opportunity-datatable-picklist', {
            is: oppdata
        });
        document.body.appendChild(element);
        const cardTitle = element.shadowRoot.querySelector('lightning-card').title;
        expect(cardTitle).toBe('Related Opportunity (0)');
    });


    it('display datatable values', () => {
        const element = createElement('c-opportunity-datatable-picklist', {
          is: oppdata
        })
        setTimeout(() => {
        element.columns = [{label:'Name',fieldName:'Name',type:'text'},
                          {label: 'Close',fieldName: 'CloseDate',type: 'text'},
                          {label: 'Stage',fieldName: 'StageName',type: 'text'}];
                          element.data = mockDataTableData;
                          document.body.appendChild(element);
     
                          return Promise.resolve().then(() => {
                            const rows = element.shadowRoot.querySelectorAll('tbody tr');
                            expect(rows.length).toBe(mockDataTableData.length);
                            rows.forEach((row, i) => {
                              const cells = row.querySelectorAll('td');
                              expect(cells.length).toBe(1);
                              expect(cells[0].textContent).toBe(mockDataTableData[i].Name);
                              expect(cells[1].textContent).toBe(mockDataTableData[i].CloseDate);
                              expect(cells[2].textContent).toBe(mockDataTableData[i].StageName);
                            });
                          });
                        }, 500);
      })




});