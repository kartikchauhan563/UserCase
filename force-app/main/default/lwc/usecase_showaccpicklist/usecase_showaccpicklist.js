/* eslint-disable no-undef */
import { LightningElement,wire } from 'lwc';
import getAccountsByCurrentUser from '@salesforce/apex/Account_userlog_show.getAccountsByCurrentUser';
import getContactsByAccount from '@salesforce/apex/Account_userlog_show.getContactsByAccount';
import { getRecord } from 'lightning/uiRecordApi';
import ACCOUNT_CHANNEL from '@salesforce/messageChannel/Account_Channel__c';
import {  MessageContext,publish } from 'lightning/messageService';
export default class Usecase_showaccpicklist extends LightningElement {

	selectedAccountId;
	selectedContactId;
	accountOptions = [];
	contactOptions = [];
	@wire(MessageContext)
    messageContext;

	@wire(getAccountsByCurrentUser)
	wiredAccounts({ error, data }) {
		if (data) {
			this.accountOptions = data.map((account) => ({
				label: account.Name,
				value: account.Id
			}));
		} else if (error) {
			console.error(error);
		}
	}

	@wire(getContactsByAccount, { accountId: '$selectedAccountId' })
	wiredContacts({ error, data }) {
		if (data) {
			this.contactOptions = data.map((contact) => ({
				label: contact.Name,
				value: contact.Id
			}));
		} else if (error) {
			console.error(error);
		}
	}

	handleAccountChange(event) {
		this.selectedAccountId = event.detail.value;
		this.selectedContactId = null;
		const messagePayloadId = { recordId: this.selectedAccountId };
		publish(this.messageContext,ACCOUNT_CHANNEL , messagePayloadId);
	}

	handleContactChange(event) {
		this.selectedContactId = event.detail.value;
	// Handle selected contact change
	}

	get isContactPickerDisabled() {
		return !this.selectedAccountId;
	}
}