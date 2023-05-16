import { api, LightningElement, track, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import OPPORTUNITY_NAME from '@salesforce/schema/Opportunity.Name';
import OPPORTUNITY_ACCOUNTNAME from '@salesforce/schema/Opportunity.AccountId';
import OPPORTUNITY_STAGENAME from '@salesforce/schema/Opportunity.StageName';
import OPPORTUNITY_CLOSEDATE from '@salesforce/schema/Opportunity.CloseDate';
import { getRecord } from 'lightning/uiRecordApi';


import {subscribe, publish, MessageContext,unsubscribe  } from 'lightning/messageService';
import OPPORTUNITY_CREATED_CHANNEL from "@salesforce/messageChannel/MyMessageChannel__c";

import ACCOUNT_SELECTED_CHANNEL from '@salesforce/messageChannel/Account_Channel__c';

//selected account Id
//import ACCOUNT_SELECTED_CHANNEL from '@salesforce/messageChannel/AccountSelected__c';


export default class CreateContact extends LightningElement {
    @track opportunityName = '';
    @track opportunityCloseDate = '';
    @track opportunityStage = '';
    
    draftValues = [];
    selectedAccountId;
    @track isDisabled=true;
    subscribe;
   
    @api recordId;
    @track opportunityStageOptions = [
        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification' },
        { label: 'Needs Analysis', value: 'Needs Analysis' },
        { label: 'Value Proposition', value: 'Value Proposition' },
        { label: 'Id. Decision Makers', value: 'Id. Decision Makers' },
        { label: 'Perception Analysis', value: 'Perception Analysis' },
        { label: 'Proposal/Price Quote', value: 'Proposal/Price Quote' },
        { label: 'Negotiation/Review', value: 'Negotiation/Review' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' }
    ];

    @wire(MessageContext)
    messageContext;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [OPPORTUNITY_NAME, OPPORTUNITY_CLOSEDATE, OPPORTUNITY_STAGENAME,OPPORTUNITY_ACCOUNTNAME]
    })
    opportunity;


    //@track isLoading = false;
    @api accountId;
    
    handleOppName(event){
        this.opportunityName = event.target.value;
        this.validateFields();

    }
    handleOppCloseDate(event){
        this.opportunityCloseDate = event.target.value;
        
        this.validateFields();
    }
    handleStage(event){
        this.opportunityStage = event.target.value;
        this.validateFields();
    }
    
    validateFields() {
        if (this.opportunityName && this.opportunityCloseDate && this.opportunityStage && this.accountId) {
            this.isDisabled = false;
        } else {
            this.isDisabled = true;
        }
    }

    @api
    createOpportunity() {
        //this.isLoading = true;
        
        const fields = {};
        fields[OPPORTUNITY_NAME.fieldApiName] = this.opportunityName;
        fields[OPPORTUNITY_CLOSEDATE.fieldApiName] = this.opportunityCloseDate;
        fields[OPPORTUNITY_STAGENAME.fieldApiName] = this.opportunityStage;
        fields[OPPORTUNITY_ACCOUNTNAME.fieldApiName] = this.accountId;

        const recordInput = { apiName: OPPORTUNITY_OBJECT.objectApiName, fields };

        createRecord(recordInput)
        .then(() => {
        //this.contactResult = contact;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Opportunity Created',
                variant: 'success',
            }),
        );
        this.clearFields();
       
        //this.isCreateContactModalOpen = false;
        
        this.publishContactCreatedMessage(); 
        this.isDisabled = true;
    })
    .catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error Creating Record',
                message: error.body.message,
                variant: 'error',
            }),
        );
    })
    // .finally(() => {
    //     this.isLoading = false; // stop the spinner
    // });

            
    }
    connectedCallback() {
        this.subscribeToMessageChannel();

    }
    subscribeToMessageChannel() {
        subscribe(this.messageContext, ACCOUNT_SELECTED_CHANNEL, (message) => {
          this.accountId = message.recordId;
          //refreshApex(this.opportunityData);
      });
      }
    
    clearFields() {
        this.opportunityName = '';
        this.opportunityCloseDate = '';
        this.opportunityStage = '';
    }
    
    
    publishContactCreatedMessage() {
        const messagePayload = {
            Id: this.recordId,
            // Object_API_Name__c: this.OPPORTUNITY_OBJECT,
            // opportunityName: this.opportunityName,
            // opportunityCloseDate:this.opportunityCloseDate,
            // opportunityStage:this.opportunityStage

        };
        publish(this.messageContext, OPPORTUNITY_CREATED_CHANNEL, messagePayload);
    }
    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    clearFields() {
        
        this.template.querySelectorAll('lightning-input').forEach((element) => {
            element.value = '';
        });
        
        this.template.querySelectorAll('lightning-combobox').forEach((element) => {
            
            element.value = '';
        });
        //this.isDisabled = true;
        this.opportunityName = '';
        this.opportunityCloseDate = '';
        this.opportunityStage = '';
        
    }
    
}