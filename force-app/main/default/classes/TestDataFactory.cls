/*************************************************************************************************************
* @Name         TestDataFactory
* @Author       Kartik Chauhan
* @description  This Factory class have all the test data
**************************************************************************************************************/
/* MODIFICATION LOG
* Version          Developer          Date               Description
*-------------------------------------------------------------------------------------------------------------
*  1.0             Kartik Chauhan     17/04/2023        Initial Creation  
*************************************************************************************************************/
public with sharing class TestDataFactory {
    /*******************************************************************************************
    * @description increment the purchased Count field value
    * @param numAccounts
    * @return accountList
    *******************************************************************************************/
   public static List<Account> getAccounts(Integer numAccounts) {
        List<Account> accountList = new List<Account>();
        for (Integer i = 0; i < numAccounts; i++) {
            Account acc = new Account();
            acc.Name = 'test'+i;
            accountList.add(acc);
        }
        if (Account.sObjectType.getDescribe().isCreateable()) {
            insert accountList;
            }
        return accountList;
    } 
    /*******************************************************************************************
    * @description increment the purchased Count field value
    * @param numOpportunity
    * @param accountId
    * @return opportunityList
    *******************************************************************************************/
   public static List<Opportunity> getOpportunityById(Integer numOpportunity,Id accountId) {
    List<Opportunity> opportunityList = new List<Opportunity>();
    for (Integer i = 0; i < numOpportunity; i++) {
        Opportunity opp = new Opportunity();
        opp.Name = 'test'+i;
        opp.StageName = 'Negotiation/Review';
        opp.CloseDate=Date.newInstance(2023,05,08);
        opp.AccountId = accountId;
        opportunityList.add(opp);

    }
    if (Opportunity.sObjectType.getDescribe().isCreateable()) {
        insert opportunityList;
        }
    return opportunityList;
} 
}