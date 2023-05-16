public with sharing class FetchOpportunityCount {  
    @auraEnabled(cacheable=true)
    public static List<Object> getStages(String accountId){
       List<Opportunity> opp = [SELECT StageName FROM Opportunity WHERE AccountId = :accountId];
       Map<String,Integer> stageMap = new Map<String,Integer>();
       Schema.DescribeFieldResult fieldResult = Opportunity.StageName.getDescribe();
       List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
       for(Schema.PicklistEntry s : ple){
           String temp = (String) s.getLabel();
           stageMap.put(temp,0);
       }
       for(Opportunity opp1 : opp){
           Integer temp = stageMap.get(opp1.StageName);
           temp++;
           stageMap.put(opp1.StageName,temp);
       }
       List<Object> stageList = new List<Object>();
       for(String stageName : stageMap.keySet()){
           stageList.add(new Map<String, Object>{
               'stageName'=> stageName,
               'count'=> stageMap.get(stageName)
           });
       }
       return stageList;
     }      
  }