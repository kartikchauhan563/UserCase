@isTest
private class FetchOppStageCountTest {

    @testSetup
    static void createTestData() {
        // create test account
        Account testAccount = new Account(Name='Test Account');
        insert testAccount;

        // create test opportunities
        List<Opportunity> testOpps = new List<Opportunity>();
    testOpps.add(new Opportunity(Name='Test Opp 1', StageName='Prospecting', AccountId=testAccount.Id, CloseDate=Date.today().addDays(30)));
    testOpps.add(new Opportunity(Name='Test Opp 2', StageName='Qualification', AccountId=testAccount.Id, CloseDate=Date.today().addDays(60)));
    testOpps.add(new Opportunity(Name='Test Opp 3', StageName='Closed Won', AccountId=testAccount.Id, CloseDate=Date.today().addDays(90)));
    insert testOpps;
    }

    @isTest
    static void testGetStages() {
        // get test account id
        Account testAccount = [SELECT Id FROM Account WHERE Name='Test Account' LIMIT 1];
        String testAccountId = testAccount.Id;

        // call the method
        Map<String, Integer> stageMap = FetchOppStageCount.getStages(testAccountId);

        // verify the result
        System.assertEquals(1, stageMap.get('Prospecting'));
        System.assertEquals(1, stageMap.get('Qualification'));
        System.assertEquals(1, stageMap.get('Closed Won'));
    }
}