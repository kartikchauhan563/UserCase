/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
import { api, LightningElement, track, wire } from 'lwc'
import fetchOpportunity from '@salesforce/apex/FetchOpportunity.getOpportunitiesByAccountId'
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'
import TYPE_FIELD from '@salesforce/schema/Opportunity.StageName'
import { updateRecord } from 'lightning/uiRecordApi'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { refreshApex } from '@salesforce/apex'
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi'
import DATA_CHANNEL from '@salesforce/messageChannel/DATA_CHANNEL__c';
import ACCOUNT_CHANNEL from '@salesforce/messageChannel/Account_Channel__c';
import IMAGES from "@salesforce/resourceUrl/noRecordFound";
import OPPORTUNITY_CHANNEL from '@salesforce/messageChannel/Opportunity_Channel__c';

//realtime data fetch
import { subscribe, MessageContext,APPLICATION_SCOPE,unsubscribe,publish } from 'lightning/messageService';
import CONTACT_CREATED_CHANNEL from "@salesforce/messageChannel/MyMessageChannel__c";

const columns = [{ label: 'Name', fieldName: 'Name' }, { label: 'Close', fieldName: 'CloseDate' },
  {
    label: 'Stage',
    fieldName: 'StageName',
    type: 'picklistColumn',
    editable: false,
    typeAttributes: {
      placeholder: 'Choose Type',
      options: { fieldName: 'pickListOptions' },
      value: { fieldName: 'StageName' },
      context: { fieldName: 'Id' }
    }
  }
]

export default class CustomDatatableDemo extends LightningElement {
  noRecordImageUrl = IMAGES;
    get cardTitle(){
      return `Related Opportunity (${this.data.length})`;
    }
  columns = columns
  showSpinner = false
    @track data = []
   
    @track opportunityData
    @track draftValues = []
    lastSavedData = []
    @track pickListOptions
    selectedAccountId;
    @api recordId;
    selectedOpportunityId;
    @track noData;

    //refresh data
    unsubscribe;
    subscription;
    @wire(MessageContext)
    messageContext;

    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
      objectInfo

    // fetch picklist options
    @wire(getPicklistValues, {
      recordTypeId: '$objectInfo.data.defaultRecordTypeId',
      fieldApiName: TYPE_FIELD
    })

    wirePickList ({ error, data }) {
      if (data) {
        this.pickListOptions = data.values
      } else if (error) {
        console.log(error)
      }
    }
    get nodata() {
      // Provide the URL or path to the image to display when no records are found
      return noRecordImageUrl;
    }
    // here I pass picklist option so that this wire method call after above method
    // eslint-disable-next-line no-dupe-class-members
    @wire(fetchOpportunity, { pickList: '$pickListOptions', accountId: '$selectedAccountId' })
    wiredopportunityData (result) {
      this.opportunityData = result
      if (result.data) {

        if (this.data) {
          this.data = JSON.parse(JSON.stringify(result.data))
        }
        if (this.data<=0) {
          this.showToast('Informational', 'No Related Opportunity Found', 'Informational', 'dismissable');
        }
        this.data.forEach(ele => {
          ele.pickListOptions = this.pickListOptions
        })
        this.lastSavedData = JSON.parse(JSON.stringify(this.data))
      } else if (result.error) {
        this.data = undefined
      }
    }
    get hasData() {
      return this.data && this.data.length > 0;
    }
    

    updateDataValues (updateItem) {
      const copyData = JSON.parse(JSON.stringify(this.data))
      copyData.forEach(item => {
        if (item.Id === updateItem.Id) {
          for (const field in updateItem) {
            item[field] = updateItem[field]
          }
        }
      })

      // write changes back to original data
      this.data = [...copyData]
    }

    updateDraftValues (updateItem) {
      let draftValueChanged = false
      const copyDraftValues = [...this.draftValues]
      copyDraftValues.forEach(item => {
        if (item.Id === updateItem.Id) {
          for (const field in updateItem) {
            item[field] = updateItem[field]
          }
          draftValueChanged = true
        }
      })

      if (draftValueChanged) {
        this.draftValues = [...copyDraftValues]
      } else {
        this.draftValues = [...copyDraftValues, updateItem]
      }
    }

    handleCellChange (event) {
      const draftValues = event.detail.draftValues
      draftValues.forEach(ele => {
        this.updateDraftValues(ele)
      })
    }

    handleSave () {
      this.showSpinner = true
      this.saveDraftValues = this.draftValues

      const recordInputs = this.saveDraftValues.slice().map(draft => {
        const fields = Object.assign({}, draft)
        return { fields }
      })

      // Updating the records using the UiRecordAPi
      const promises = recordInputs.map(recordInput => updateRecord(recordInput))
      Promise.all(promises).then(res => {
        this.showToast('Success', 'Records Updated Successfully!', 'success', 'dismissable')
        this.draftValues = []
        return this.refresh()
      }).catch(error => {
        console.log(error)
        this.showToast('Error', 'An Error Occured!!', 'error', 'dismissable')
      }).finally(() => {
        this.draftValues = []
        this.showSpinner = false
      })
    }

    handleCancel () {
      // remove draftValues & revert data changes
      this.data = JSON.parse(JSON.stringify(this.lastSavedData))
      this.draftValues = []
    }

    showToast (title, message, variant, mode) {
      const evt = new ShowToastEvent({
        title,
        message,
        variant,
        mode
      })
      this.dispatchEvent(evt)
    }

    //LMS code start

    connectedCallback() {
      this.subscribeToMessageChannel();
      this.subscribeToContactCreatedChannel();
      this.subscribeToOpportunityAccountChannel();
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
  
   //gourav code start
   subscribeToOpportunityAccountChannel() {
    subscribe(this.messageContext, DATA_CHANNEL, (message) => this.handleOpportunitySelectedMessage(message),
      { scope: APPLICATION_SCOPE }
     
  );
  }
  handleOpportunitySelectedMessage(message){
    refreshApex(this.opportunityData);
    console.log('this is subscribe');
  }
//code end
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
    async refresh () {
      await refreshApex(this.opportunityData)
    }
       //LMS code end


       handleRowSelected(event) {
        const selectedRows = event.detail.selectedRows;
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            //alert("You selected: " + selectedRows[i].Id);
            this.selectedOpportunityId=selectedRows[i].Id;
        }
        //gourav code start
        const messagePayloadId = { recordId: this.selectedOpportunityId };
        publish(this.messageContext, OPPORTUNITY_CHANNEL, messagePayloadId);
        //gourav code end
    }
}