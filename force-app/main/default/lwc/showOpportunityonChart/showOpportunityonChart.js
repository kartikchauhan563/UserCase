import { LightningElement, wire, track, api } from 'lwc';
import getStages from '@salesforce/apex/FetchOpportunityCount.getStages';
import { refreshApex } from '@salesforce/apex';
import ACCOUNT_CHANNEL from '@salesforce/messageChannel/Account_Channel__c';
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';

export default class ShowOpportunityonChart extends LightningElement {
  @track selectedAccountId;
  subscription;
  unsubscribe;
  @api recordId;
  @track chartConfiguration;
  @track opportunities;
  @wire(MessageContext)
  messageContext;
  wiredStagesResult;

  //fetching data from org
  @wire(getStages, { accountId: '$selectedAccountId' })
  wiredgetStages(result) {
    this.wiredStagesResult = result;
    if (result.data) {
      this.opportunities = result.data;
      //chart function calling
      this.updateChartData(result.data);
    } else if (result.error) {
      this.error = result.error;
      console.log('error => ' + JSON.stringify(result.error));
      this.chartConfiguration = undefined;
    }
  }

  //subscribe code
  connectedCallback() {
    this.subscribeToOpportunityAccountChannel();
  }

  handleMessage(message) {
    this.selectedAccountId = message.recordId;
    this.refreshChartData();
  }

  subscribeToOpportunityAccountChannel() {
    this.subscription = subscribe(
      this.messageContext,
      ACCOUNT_CHANNEL,
      (message) => {
        this.selectedAccountId = message.recordId;
        this.refreshChartData();
      }
    );
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
  //subscribe end
  //chart function start
  updateChartData(data) {
    let chartData = [];
    let chartLabels = [];
    data.forEach((opp) => {
      chartData.push(opp.count);
      chartLabels.push(opp.stageName);
    });
    this.chartConfiguration = {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Closed Won Last Week',
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            backgroundColor: 'green',
            data: chartData,
          },
        ],
      },
      options: {},
    };
    console.log('data => ', data);
  }
  //function end
  //refresh apex start
  refreshChartData() {
    refreshApex(this.wiredStagesResult)
      .then((result) => {
        this.opportunities = result.data;
        this.updateChartData(result.data);
      })
      .catch((error) => {
        this.error = error;
        console.log('error => ' + JSON.stringify(error));
        this.chartConfiguration = undefined;
      });
  }
  //refresh apex end
}