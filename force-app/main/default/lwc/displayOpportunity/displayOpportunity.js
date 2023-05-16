import { LightningElement,wire,track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import OPPORTUNITY_CHANNEL from '@salesforce/messageChannel/Opportunity_Channel__c';
import DATA_CHANNEL from '@salesforce/messageChannel/DATA_CHANNEL__c';
import { subscribe, MessageContext,unsubscribe,publish } from 'lightning/messageService';
import IMAGES from "@salesforce/resourceUrl/noRecordFound";
export default class DisplayOpportunity extends LightningElement {
   // @api recordId;
    objectApiName =OPPORTUNITY_OBJECT;
    @wire(MessageContext)
    messageContext;
    unsubscribe;
    subscription;
   OpportunityId;
   @track imageUrl = IMAGES;
   @track data=false;

   //kartik start
    @api height;
    @api background;
    @api color;

    get componentStyle() {
        return `height:${this.height}px;background:${this.background};color:${this.color};`;
    }
   //kartik end


    connectedCallback() {
        this.subscribeToOpportunityChannel();
       this.data=true;
      }
      handleMessage(message) {
        this.accountId = message.accountId;
      }


      subscribeToOpportunityChannel() {
        subscribe(this.messageContext, OPPORTUNITY_CHANNEL, (message) => {
          this.OpportunityId = message.recordId;
      });
      }
      disconnectedCallback() {
        // Unsubscribe from the message channel when the component is destroyed
        unsubscribe(this.subscription);
        this.subscription = null;
      this.data=false;
      }
      handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'Opportunity Edited Successfully',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
        publish(this.messageContext, DATA_CHANNEL);
       
    }
    
}