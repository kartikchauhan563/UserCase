/*************************************************************************************************************
* @Name         FetchOpportunity
* @Author       Kartik Chauhan
* @description  This Class will fetch the Opportunity Record
**************************************************************************************************************/
/* MODIFICATION LOG
* Version          Developer          Date               Description
*-------------------------------------------------------------------------------------------------------------
*  1.0             Kartik Chauhan          01/02/2023        Initial Creation    
*************************************************************************************************************/
public with sharing class FetchOpportunity {
    @auraEnabled(cacheable=true)
    /*******************************************************************************************
    * @description This Method will return the list of contacts
    * @param accountId
    * @return return [SELECT Id, Name, StageName, Amount, CloseDate
                FROM Opportunity WHERE AccountId = :accountId];
    *******************************************************************************************/
    public static List<Opportunity> getOpportunitiesByAccountId (String accountId)
    {
        //return [SELECT Id, Name,StageName, CloseDate FROM Opportunity WHERE AccountId = :selectedAccountId WITH SECURITY_ENFORCED ORDER  BY LastModifiedDate DESC LIMIT 10];
        return [SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity WHERE AccountId = :accountId WITH SECURITY_ENFORCED ORDER BY LastModifiedDate DESC];
    }
    @auraEnabled(cacheable=true)
    /*******************************************************************************************
    * @description This Method will return the list of contacts
    
    * @return [SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity WITH SECURITY_ENFORCED ORDER BY LastModifiedDate DESC];
    *******************************************************************************************/
    public static List<Opportunity> getAllOpportunity(){
        return [SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity WITH SECURITY_ENFORCED ORDER BY LastModifiedDate DESC];
    }



    @AuraEnabled(Cacheable = true)
    /*******************************************************************************************
    * @description This Method will return the list of contacts
    * @param textkey
    * @return oppList;
    *******************************************************************************************/
    public static list<Opportunity> getOpportunityDataforSearch(String textkey) {
        textkey = '%' + textkey + '%';
        list<Opportunity> oppList = [SELECT Id, Name, StageName, Amount, CloseDate From Opportunity WHERE Name LIKE :textkey WITH SECURITY_ENFORCED];
        
        if(oppList.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        return oppList; 
    }
}