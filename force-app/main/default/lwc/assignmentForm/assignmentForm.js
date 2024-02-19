import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { MessageContext, publish } from "lightning/messageService";
import ASSIGNMENT_MESSAGE_CHANNEL from "@salesforce/messageChannel/AssignmentChannel__c";

export default class AssignmentForm extends LightningElement {

    @wire(MessageContext)
    messageContext

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Success",
            message: "Record Created Successfully",
            variant: "success",
        });
        this.dispatchEvent(evt);
        this.handleReset();
        publish(this.messageContext, ASSIGNMENT_MESSAGE_CHANNEL, { eventType: 'refresh' });
        console.log('sent the event')
    }

    handleSubmit(event) {
        event.preventDefault();
        //Can manipulate if there is some extended logic
        const fields = event.detail.fields;

        if (!this.validateFields()) {
            const toast = new ShowToastEvent({
                message: "Review all error messages below to correct your data.",
                variant: "error",
            });
            this.dispatchEvent(toast);
        }
        else {
            this.template.querySelector("lightning-record-edit-form").submit();
        }
    }

    handleReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
    //If there are any validations 
    // We can even set errors if needed
    validateFields() {
        return [...this.template.querySelectorAll("lightning-input-field")].reduce((validSoFar, field) => {
            return (validSoFar && field.reportValidity());
        }, true);
    }

}