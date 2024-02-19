import { LightningElement, wire, api, track } from 'lwc';
import getAssignmentList from '@salesforce/apex/AssignmentController.getAssignmentList';
import { refreshApex } from "@salesforce/apex";
import { MessageContext, subscribe, APPLICATION_SCOPE } from "lightning/messageService";
import ASSIGNMENT_MESSAGE_CHANNEL from "@salesforce/messageChannel/AssignmentChannel__c";

const columns = [
    { label: 'Title', fieldName: 'Title__c' },
    { label: 'Description', fieldName: 'Description__c' },
    { label: 'Priority', fieldName: 'Priority__c' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Due Date', fieldName: 'DueDate__c', type: 'date' },
];

export default class AssignmentList extends LightningElement {
    @track
    data = [];

    columns = columns;

    @track
    onLoadListItems = [];
    subscription = null;

    @track assignmentListWiredResult = []; 
    currentPage = 1;
    rowsPerPage = 5;
    totalPages = 0;

    @wire(MessageContext)
    messageContext;

    @wire(getAssignmentList)
    handleAssignmentList(result) {
        this.assignmentListWiredResult = result;
        let { data, error } = result;
        if (data) {
            this.onLoadListItems = data;
            this.data = this.getCurrentPageData();
            console.log("the new data " + JSON.stringify(this.data));
        } else if (error) {
            console.log('Error', error);
        }
    }
    connectedCallback() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                ASSIGNMENT_MESSAGE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE },
            );
        }
    }


    handleMessage(eventData) {
        if (eventData.eventType == 'refresh') {
            console.log('refreshing data now  ')
            this.refreshTableData();
        }
    }

    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
        if (!searchKey) {
            this.data = this.onLoadListItems;
        }
        this.data = this.filterAssignmentListData(this.data, searchKey);
    }

    filterAssignmentListData(assignmentListData, searchString) {
        return assignmentListData.filter(item => {
            const titleMatch = item.Title__c.toLowerCase().includes(searchString.toLowerCase());
            const statusMatch = item.Status__c.toLowerCase().includes(searchString.toLowerCase());

            return titleMatch || statusMatch;
        });
    }

    //We can use exposed API methods if nest this inside a parent
    @api
    refreshTableData() {
        refreshApex(this.assignmentListWiredResult);
        console.log("refreshed the data ");
    }

    getCurrentPageData() {
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        this.totalPages = Math.ceil(this.onLoadListItems.length / this.rowsPerPage);
        return this.onLoadListItems.slice(startIndex, endIndex);
    }

    nextPage() {
        this.totalPages = Math.ceil(this.onLoadListItems.length / this.rowsPerPage);
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
        this.updateTable();
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
        this.updateTable();
    }

    updateTable() {
        this.data = this.getCurrentPageData();
    }

    get disablePrevious() {
        return this.currentPage <= 1
    }
    get disableNext() {
        return this.currentPage >= this.totalPages
    }
}