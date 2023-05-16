import {  api, LightningElement,  track,  wire } from 'lwc'
import fetchOpportunity from '@salesforce/apex/FetchOpportunity.getOpportunitiesByAccountId'
import { refreshApex } from '@salesforce/apex'
import ACCOUNT_CHANNEL from '@salesforce/messageChannel/Account_Channel__c';
import OPPORTUNITY_CHANNEL from '@salesforce/messageChannel/Opportunity_Channel__c';
import searchOpportunity from '@salesforce/apex/FetchOpportunity.getOpportunityDataforSearch';
//realtime data fetch
import { subscribe, MessageContext,APPLICATION_SCOPE,unsubscribe,publish } from 'lightning/messageService';
import CONTACT_CREATED_CHANNEL from "@salesforce/messageChannel/MyMessageChannel__c";

export default class SideNavigationLWC extends LightningElement {
    selectedNav = 'default_recent';
    unsubscribe;
    subscription;
    @wire(MessageContext)
    messageContext;
    @track data = []
    @api recordId;
    @track opportunityData
    selectedAccountId;
    selectedOpportunityId
    @track totalOpportunity='';
    newData;
    //search variable
    searchKey;
    //collapse Navigation Pannel Code
    togglePanel() {
        let leftPanel = this.template.querySelector("div[data-my-id=leftPanel]");
        //let rightPanel = this.template.querySelector("div[data-my-id=rightPanel]");

        if (leftPanel.classList.contains('slds-is-open')) {
            leftPanel.classList.remove("slds-is-open");
            leftPanel.classList.remove("open-panel");
            leftPanel.classList.add("slds-is-closed");
            leftPanel.classList.add("close-panel");
            //rightPanel.classList.add("expand-panel");
            //rightPanel.classList.remove("collapse-panel");
        } else {
            leftPanel.classList.add("slds-is-open");
            leftPanel.classList.add("open-panel");
            leftPanel.classList.remove("slds-is-closed");
            leftPanel.classList.remove("close-panel");
            //rightPanel.classList.remove("expand-panel");
            //rightPanel.classList.add("collapse-panel");
        }
    }

    refreshUserData(evt){
        const buttonIcon = evt.target.querySelector('.slds-button__icon');
        buttonIcon.classList.add('refreshRotate');

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            buttonIcon.classList.remove('refreshRotate');
        }, 1000);
    }

    handleSelect(event) {
        const selected = event.detail.name;
        this.selectedNav = selected;
    }
   
    @wire(fetchOpportunity, { accountId: '$selectedAccountId' })
    wiredopportunityData (result) {
        
      this.opportunityData = result
      if (result.data) {
        if (this.data) {
          this.data = JSON.parse(JSON.stringify(result.data));
          this.totalOpportunity = this.data.length;
          this.newData = this.data;
        }
      } else if (result.error) {
        this.data = undefined
      }
    }
    
    handelSearchKey(event) {
        const searchKey = event.target.value.toLowerCase();
        if(searchKey===''){
          
            this.newData = JSON.parse(JSON.stringify(this.opportunityData));
       
        }
        let filteredOpportunities;
        filteredOpportunities = this.data.filter(item => item.Name.toLowerCase().includes(searchKey));
        this.totalOpportunity = filteredOpportunities.length;
        this.newData = JSON.parse(JSON.stringify(filteredOpportunities));
        
    }
    
    

      connectedCallback() {
        this.subscribeToMessageChannel();
        this.subscribeToContactCreatedChannel();
      }
      handleMessage(message) {
        this.accountId = message.accountId;
      }
      subscribeToMessageChannel() {
        this.subscription = subscribe(
          this.messageContext,
          ACCOUNT_CHANNEL,
          (message) => this.handleAccountSelectedMessage(message),
          { scope: APPLICATION_SCOPE }
        );
      }
      handleAccountSelectedMessage(message) {
        this.selectedAccountId = message.recordId;
        refreshApex(this.opportunityData);
  
      }
      subscribeToContactCreatedChannel() {
        this.subscription = subscribe(
            this.messageContext,
            CONTACT_CREATED_CHANNEL,
            (message) => {
                this.handleContactCreatedMessage(message);
              refreshApex(this.opportunityData);
              },{scope:APPLICATION_SCOPE}
        );
      }
      handleContactCreatedMessage() {
        //this.opportunityData = [...this.opportunityData, message.context];
        return refreshApex(this.opportunityData);
      }
      disconnectedCallback() {
        // Unsubscribe from the message channel when the component is destroyed
        unsubscribe(this.subscription);
        this.subscription = null;
      }
      // This function is used to refresh the table once data updated
    //   async refresh () {
    //     await refreshApex(this.opportunityData)
    //   }

      handleItemClick(event) {
        this.selectedOpportunityId=event.target.dataset.id;
        const messagePayloadId = { recordId: this.selectedOpportunityId };
        publish(this.messageContext, OPPORTUNITY_CHANNEL, messagePayloadId);
        
    }
}



