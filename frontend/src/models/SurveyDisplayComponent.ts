import { Component } from "vue";
import { SurveyComponent } from "./SurveyComponent";

export class SurveyDisplayComponent {

    surveyComponent: SurveyComponent
    displayComponent: any

    constructor(surveyComponent: SurveyComponent, displayComponent: any) {
        this.surveyComponent = surveyComponent;
        this.displayComponent = displayComponent;
    }
}