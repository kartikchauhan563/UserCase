@isTest
public class FetchOpportunity_Test {

    @isTest
    static void testgetOpportunitiesByAccountId(){
    
    List<Account> accList  = TestDataFactory.getAccounts(1);
    
    List<Opportunity> oppList = TestDataFactory.getOpportunityById(1, accList[0].Id);
    Test.startTest();
        List<Opportunity> opp = FetchOpportunity.getOpportunitiesByAccountId(accList[0].Id);
    Test.stopTest();
    // Verify results
        System.assertEquals(oppList[0].Id, opp[0].Id);
    }
}