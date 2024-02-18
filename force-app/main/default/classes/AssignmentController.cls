public class AssignmentController {
    @AuraEnabled(cacheable=true)
    public static List<AssignmentGroup__c> getAssignements() {
        return [
            select id,name,GroupDescription__c,(select id,Title__c,Description__c, 
            DueDate__c, Priority__c, Status__c from Assignments__r) 
            from AssignmentGroup__c  
        ];
    }

}