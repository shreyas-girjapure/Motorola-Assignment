import { LightningElement ,wire,track } from 'lwc';
import getAssignements from '@salesforce/apex/AssignmentController.getAssignements';

// COLUMNS =[
//     {"type":"text","fieldName":"name","label":"Name"},
//     {"type":"text","fieldName":"description","label":"Description"}
// ]
export default class AssignmentTree extends LightningElement {

    @track record;
    @track error;

    @wire(getAssignements) 
    assignmentsRecords({data,error}){
        if(data){
            this.record = data;
            this.error = undefined;
        } else if(error){
            console.log('Error',error);
            this.error = error;
            this.record = undefined;
        }
    }

}