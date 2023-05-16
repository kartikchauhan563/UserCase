public with sharing class FetchOppStageCount {  
  @auraEnabled(cacheable=true)
  public static Map<String,Integer> getStages(String accountId){
     List<Opportunity> opp = [Select id,Amount,stageName from Opportunity where AccountId= :accountId];
     Map<String,Integer> stageMap = new Map<String,Integer>();
     Schema.DescribeFieldResult fieldResult = Opportunity.StageName.getDescribe();
     List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
     for(Schema.PicklistEntry s:ple){
     String temp = (String) s.getLabel();
     stageMap.put(temp,0);
     }
     for(Opportunity opp1:opp){
     Integer temp = stageMap.get(opp1.stageName);
     temp++;
     stageMap.put(opp1.stageName,temp);
     }
     return stageMap;
   }      
}