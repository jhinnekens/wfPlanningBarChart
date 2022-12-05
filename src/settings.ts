/*
 *  Power BI Visualizations
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

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */
class DataPointCardSettings extends FormattingSettingsCard {

 
    colorFerme = new formattingSettings.ColorPicker({
        name: "colorFerme",
        displayName: "Couleur du ferme",
        value: { value: "#EB8C00" }
    });

    colorPrevis = new formattingSettings.ColorPicker({
        name: "colorPrevis",
        displayName: "Couleur du previs",
        value: { value: "#CCCCCC" }
    });

    colorBudgetGood = new formattingSettings.ColorPicker({
        name: "colorBudgetGood",
        displayName: "Couleur du Budget Good",
        value: { value: "#21992D" }
    });

    colorBudgetBad = new formattingSettings.ColorPicker({
        name: "colorBudgetBad",
        displayName: "Couleur du Budget Bad",
        value: { value: "#C52A1A" }
    });

    ValueType = new formattingSettings.ItemDropdown({
        name: "ValueType",
        displayName: "Type des valeurs",
        items:  [
            {
                "value": "0",
                "displayName": "Nombre Standard"
            },
            {
                "value": "1",
                "displayName": "Nombre avec K et M"
            },
            {
                "value": "2",
                "displayName": "Pourcentage"
            }
        ],
        value:  {
            "value": "0",
            "displayName": "Nombre Standard"
        }
    
    });

    name: string = "dataPoint";
    displayName: string = "Propriétés du graph";
    slices: Array<FormattingSettingsSlice> = [this.colorFerme, this.colorPrevis, this.colorBudgetGood, this.colorBudgetBad, this.ValueType];
}

/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    dataPointCard = new DataPointCardSettings();

    cards = [this.dataPointCard];
}
