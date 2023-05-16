/*************************************************************************************************************
* @Name         Account_userlog_show
* @Author       Yash Pradhan
* @description  This class is to perform Account Account_userlog_showfor usecase_showpiclist
**************************************************************************************************************/
/* MODIFICATION LOG
* Version          Developer          Date               Description
*-------------------------------------------------------------------------------------------------------------
*  1.0             Yash Pradhan    8/05/2023        Initial Creation  
*************************************************************************************************************/
public with sharing class Account_userlog_show {
   @AuraEnabled(cacheable=true)
    /*******************************************************************************************
    * @description   This method will invoke on account created own 
    * @return [SELECT Id, Name FROM Account WHERE OwnerId = :currentUserId];
    *******************************************************************************************/   
   public static List<Account> getAccountsByCurrentUser() {
         String currentUserId = UserInfo.getUserId();
      return [SELECT Id, Name FROM Account WHERE OwnerId = :currentUserId WITH SECURITY_ENFORCED];
}
/*******************************************************************************************
    * @description   This method will invoke on account created own 
    * @param accountId 
    * @return [SELECT Id, Name FROM Contact WHERE AccountId = :accountId WITH SECURITY_ENFORCED];
    *******************************************************************************************/ 
@AuraEnabled(cacheable=true)
    public static List<Contact> getContactsByAccount(String accountId) {
        return [SELECT Id, Name FROM Contact WHERE AccountId = :accountId WITH SECURITY_ENFORCED];
    }
    
}