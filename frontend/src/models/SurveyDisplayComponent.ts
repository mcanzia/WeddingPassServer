import { Component } from "vue";
import { SurveyComponent } from "./SurveyComponent";

export class SurveyDisplayComponent {

    surveyComponent: SurveyComponent
    displayComponent: any
    hasOptions: boolean

    constructor(surveyComponent: SurveyComponent, displayComponent: any, hasOptions: boolean) {
        this.surveyComponent = surveyComponent;
        this.displayComponent = displayComponent;
        this.hasOptions = hasOptions;
    }
}