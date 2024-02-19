public class AssignmentController {
    
    @AuraEnabled(cacheable=true)
    public static List<AssignmentGroup__c> getGroupAndAssignments() {
        return [
            select id,name,GroupDescription__c,(select id,Title__c,Description__c, 
            DueDate__c, Priority__c, Status__c from Assignments__r) 
            from AssignmentGroup__c  
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Assignment__c> getAssignmentList(){
        List<Assignment__c> assignmentList = new List<Assignment__c>();
        try {    
            assignmentList = [select Id, Name,  Title__c, Description__c, DueDate__c, Status__c, Priority__c, AssignmentGroup__c 
            from Assignment__c order by DueDate__c];
        } catch (Exception ex) {
            throw new AuraHandledException('Error '+ex.getMessage());
        }
        return assignmentList;
    }

}