import { LightningElement, wire, track } from 'lwc';
import getGroupAndAssignments from '@salesforce/apex/AssignmentController.getGroupAndAssignments';

const COLUMNS_DEFINITION = [
    {
        type: 'text',
        fieldName: 'Name',
        label: 'Name',
    },
    {
        type: 'text',
        fieldName: 'Description__c',
        label: 'Description',
    },
];

export default class AssignmentTree extends LightningElement {

    @track
    gridColumns = COLUMNS_DEFINITION;
    @track
    gridData;

    @wire(getGroupAndAssignments)
    handleGroupAndAssignmentResult({ data, error }) {
        if (data) {
            console.log('the data ' + JSON.stringify(data));
            let transformedData = this.transformKeyMappings(data);
            console.log('the data Tra' , transformedData);
            this.gridData = transformedData;
        } else if (error) {
            console.log('Error', error);
        }
    }

    transformKeyMappings(dataList) {
        let newMappingsForKeys = {
            "GroupDescription__c": "Description__c",
            "Title__c": "Name",
            "Assignments__r": "_children"
        };
        return dataList.map(group => {
            let newGroup = { ...group };

            // Update keys in the main group
            Object.keys(newGroup).forEach(key => {
                if (newMappingsForKeys[key]) {
                    newGroup[newMappingsForKeys[key]] = newGroup[key];
                    if (key !== newMappingsForKeys[key]) {
                        delete newGroup[key];
                    }
                }
            });

            // Update keys in the Assignments__r array
            if (newGroup._children) {
                newGroup._children = newGroup._children.map(assignment => {
                    let newAssignment = { ...assignment };
                    Object.keys(newAssignment).forEach(key => {
                        if (newMappingsForKeys[key]) {
                            newAssignment[newMappingsForKeys[key]] = newAssignment[key];
                            if (key !== newMappingsForKeys[key]) {
                                delete newAssignment[key];
                            }
                        }
                    });
                    return newAssignment;
                });
            }

            return newGroup;
        });
    }

}