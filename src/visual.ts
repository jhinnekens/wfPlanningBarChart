/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import DataViewTable = powerbi.DataViewTable;
import DataViewTableRow = powerbi.DataViewTableRow;
import * as d3 from "d3";

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {

    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private graphRootDiv: HTMLElement;
    private target: HTMLElement;
    

    constructor(options: VisualConstructorOptions) {

    this.formattingSettingsService = new FormattingSettingsService();
     


        this.target = options.element;

        if (document) {
            this.graphRootDiv = document.createElement("div");
            this.graphRootDiv.classList.add("barChart");
            this.target.appendChild(this.graphRootDiv);
            

            
        
        }


      
        

    }
     


    public update(options: VisualUpdateOptions) {



        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);

        const dataView: DataView = options.dataViews[0];
        const tableDataView: DataViewTable = dataView.table;


        let colorFerme = this.formattingSettings.cards[0].colorFerme.value.value;
        let colorPrevis = this.formattingSettings.cards[0].colorPrevis.value.value;
        let colorBudgetGood = this.formattingSettings.cards[0].colorBudgetGood.value.value;
        let colorBudgetBad = this.formattingSettings.cards[0].colorBudgetBad.value.value;

        let ValueType = this.formattingSettings.cards[0].ValueType.value.value;


        if (!tableDataView) 
            return;
        


        let TableData = [];

        
        //creation of a table of objects
        tableDataView.rows.forEach((row: DataViewTableRow) => {
  

            let dataRow : any = {};


            // This filter allows to get the data in a simple table
            dataRow.category1 = row[tableDataView.columns.filter((d) => d.roles.category1 != undefined )[0].index];
            dataRow.Chargeable = row[tableDataView.columns.filter((d) => d.roles.Chargeable != undefined )[0].index];
            dataRow.Previs = row[tableDataView.columns.filter((d) => d.roles.Previs != undefined )[0].index];
            dataRow.Budget = row[tableDataView.columns.filter((d) => d.roles.Budget != undefined )[0].index];
            dataRow.PrevFerme = row[tableDataView.columns.filter((d) => d.roles.PrevFerme != undefined )[0].index];

            TableData.push(dataRow);

            console.log(dataRow);
    
          
        });

        if (ValueType == 0 )
        {
            
            var format = function(d) { return <string>(Math.round(d*10)/10).toString(); }
            var multiplier = 80/ d3.max(TableData, function(d) { return d.Chargeable + d.Previs} );
        }

        else if (ValueType == 1)
        {
            var format = function(d) { 
                
                if (d < 10000)
                return <string>(Math.round(d*10)/10).toString();

                else if (d < 1000000)
                return <string>(Math.round(d/100)/10).toString() + "K";

                else
                return <string>(Math.round(d/10000)/100).toString() + "M";
            
            }
            var multiplier = 80/ d3.max(TableData, function(d) { return d.Chargeable + d.Previs} );
        }

        else 
        {
            var format = function(d) { return (Math.round((d)*1000)/10).toString() + "%"; }
            var multiplier = 80;
        }

        


        this.graphRootDiv.innerHTML = "";

        /*
      const ordinate =  this.graphRootDiv.appendChild(document.createElement("div"));
      ordinate.classList.add("barChart-ordinate");
      */


      TableData.forEach((d) => 
      {

        let barChartElement =  this.graphRootDiv.appendChild(document.createElement("div"));
        barChartElement.classList.add("barChart-Element");
        barChartElement.setAttribute("style", "height:calc(" + (100/TableData.length).toString() + "% - 10px);");

        let barChartElementAligner =  barChartElement.appendChild(document.createElement("div"));
        barChartElementAligner.classList.add("barChart-Element-Aligner");
  

        let barChartElementLegend =  barChartElement.appendChild(document.createElement("div"));
        barChartElementLegend.classList.add("barChart-Element-legend");
        barChartElementLegend.appendChild(document.createTextNode(d.category1));
        
        
        let barChartElementBar =  barChartElement.appendChild(document.createElement("div"));
        barChartElementBar.classList.add("barChart-Element-bar");
        

        let barChartElementInner1 =  barChartElementBar.appendChild(document.createElement("div"));
        barChartElementInner1.classList.add("barChart-Element-inner");
        barChartElementInner1.setAttribute("style", "width: "  + (multiplier * d.Chargeable).toString() + "%;background-color:" + colorFerme);

        let barChartElementInner2 =  barChartElementBar.appendChild(document.createElement("div"));
        barChartElementInner2.classList.add("barChart-Element-inner");
        barChartElementInner2.classList.add("color2");
        barChartElementInner2.setAttribute("style", "width: "  + (multiplier * d.Previs).toString() + "%;background-color:" + colorPrevis);

        let barChartElementInnerText =  barChartElementBar.appendChild(document.createElement("div"));
        barChartElementInnerText.classList.add("barChart-Element-innerText");
        barChartElementInnerText.appendChild(document.createTextNode(format(d.Chargeable+d.Previs)));

        if (d.Budget) // On display le budget que s'il y a un budget
        {
          let barChartElementBudget =  barChartElement.appendChild(document.createElement("div"));
          barChartElementBudget.classList.add("barChart-Element-budget");
  
          if (d.Budget > d.Chargeable)
          barChartElementBudget.setAttribute("style", "color:" + colorBudgetBad);
  
          else
          barChartElementBudget.setAttribute("style", "color:" + colorBudgetGood);
          
          let sign  = d.Budget > d.Chargeable ? '▼-' : '▲+';
          if (d.PrevFerme=="Ferme")  // si la valeur du Slicer est égale à "Ferme"
           barChartElementBudget.appendChild(document.createTextNode(sign + format(Math.abs(d.Chargeable-d.Budget))));
          else if (d.PrevFerme=="Prévisionnel")  // si la valeur du Slicer est égale à "Prévisionnel"
           barChartElementBudget.appendChild(document.createTextNode(sign + format(Math.abs(d.Previs-d.Budget))));
          else // si la valeur du Slicer est égale à "Les deux"
           barChartElementBudget.appendChild(document.createTextNode(sign + format(Math.abs((d.Chargeable+d.Previs)-d.Budget))));


        }


      })
      ;

    }
    

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}