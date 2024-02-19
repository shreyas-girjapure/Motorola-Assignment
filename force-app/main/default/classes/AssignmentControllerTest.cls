@isTest
public  class AssignmentControllerTest {
    
    @testSetup static void setup() {
        List<AssignmentGroup__c> testAssignmentGroups = new List<AssignmentGroup__c>();
        List<Assignment__c> testAssignments = new List<Assignment__c>();
        for(Integer i=0;i<5;i++) {
            testAssignmentGroups.add(new AssignmentGroup__c(Name = 'Test Group'+i));
        }
        insert testAssignmentGroups;
        
        for(Integer i = 0 ; i < 5 ; i++){
            Assignment__c assignment = new Assignment__c();
            assignment.Title__c = 'Test Assignment' + i;
            assignment.Description__c = 'Test Description';
            assignment.AssignmentGroup__c = testAssignmentGroups[i].Id;
            assignment.Priority__c = 'High';
            assignment.Status__c = 'Not Started';
            testAssignments.add(assignment);
        }
    }


    @isTest
    public static void getGroupAndAssignmentsTest() {
        Test.startTest();
        AssignmentController.getGroupAndAssignments();
        Test.stopTest();
    }

    @isTest
    public static void getAssignmentListTest() {
        Test.startTest();
        AssignmentController.getAssignmentList();
        Test.stopTest();
    }
}