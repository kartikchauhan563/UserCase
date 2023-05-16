/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
import { LightningElement,track,wire } from 'lwc';
import getStages from '@salesforce/apex/FetchOppStageCount.getStages'
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'
import { refreshApex } from '@salesforce/apex'
import IMAGES from "@salesforce/resourceUrl/noRecordFound";
import ACCOUNT_CHANNEL from '@salesforce/messageChannel/Account_Channel__c';

//realtime data fetch
import { subscribe, MessageContext,unsubscribe } from 'lightning/messageService';

export default class OpportunityStages extends LightningElement {
    objectApiName=OPPORTUNITY_OBJECT;
    selectedAccountId;
    unsubscribe;
    subscription;
    stageData;
    @wire(MessageContext)
    messageContext;
  @track info=false;
  @track imageUrl = IMAGES;
    @track map=[];
    @wire(getStages,{accountId:'$selectedAccountId'})
    wiredStage({data,error}){
      this.map=[];
     this.stageData=data;
      if(data){
        for(let key in data){
          this.map.push({value:data[key],key:key});
          this.info=true;
        }
      }else if(error){
        window.console.log(error);
      }
    }
   

    connectedCallback() {
      this.subscribeToOpportunityAccountChannel();
     
    }

    handleMessage(message) {
      this.accountId = message.accountId;
    }

    subscribeToOpportunityAccountChannel() {
      subscribe(this.messageContext, ACCOUNT_CHANNEL, (message) => {
        this.selectedAccountId = message.recordId;
        refreshApex(this.stageData)
    });
    }
    disconnectedCallback() {
      // Unsubscribe from the message channel when the component is destroyed
      unsubscribe(this.subscription);
      this.subscription = null;
    }
    async refresh () {
      await refreshApex(this.stageData)
    }
   
}