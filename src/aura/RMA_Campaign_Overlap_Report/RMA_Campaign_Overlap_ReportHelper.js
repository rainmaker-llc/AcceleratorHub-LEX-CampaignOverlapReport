({
    getSOQLQueries : function(component, event, helper) {
    	var action = component.get("c.getSOQLQueries");
        // set a callBack    
        action.setCallback(this, function(response) {
            var state = response.getState();
            //console.log('@@@@@@@@@',response.getReturnValue());
            if (state === "SUCCESS") {
                var index = 0;
                for(index in response.getReturnValue()){
                    var queryobj = response.getReturnValue()[index];
                    //console.log('$$$$$',queryobj.obj);
                    if(queryobj.obj == 'Lead'){
            			component.set("v.leadSoqlQueries",queryobj);                
                    }
                    else{
                        component.set("v.contactSoqlQueries",queryobj);                 
                    }
                }
                //console.log('@@@@@@@@@',component.get("v.leadSoqlQueries"));
                //console.log('@@@@@@@@@',component.get("v.contactSoqlQueries"));
            }
        });
        // enqueue the Action  
        $A.enqueueAction(action);    
    },
    // This function add value in list
    searchHelper : function(component, event, getInputkeyWord) {
        var action = component.get("c.getCampaign");
        var option1Value = [];
        var option2Value = [];
        // set param to method  
        action.setParams({
            'searchKeyWord': getInputkeyWord
        });
        // set a callBack    
        action.setCallback(this, function(response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            $A.util.addClass(component.find("mySpinner"), "slds-hide");
            $A.util.removeClass(component.find("mySpinner1"), "slds-show");
            $A.util.addClass(component.find("mySpinner1"), "slds-hide");
            var state = response.getState();
            if (state === "SUCCESS") {
                var campaignsList = response.getReturnValue();
                // if storeResponse size is greater then 0
                if (campaignsList.length > 0) {
                    campaignsList.forEach(function(rec){
                        if(rec.Name != component.get("v.SearchKeyWord1")){
                            option1Value.push(rec);
                        }
                        if(rec.Name != component.get("v.SearchKeyWord")){
                            option2Value.push(rec);
                        }
                    });
                    component.set("v.Campaign1", option1Value);
                    component.set("v.Campaign2", option2Value);
                }
            }
        });
        // enqueue the Action  
        $A.enqueueAction(action);
    },
    
    // This function call when the User click button.
    handleClick : function(component,event,helper){
        var tableDiv = document.getElementById('tableDiv');
        var objRec = [];
        var overlapCampaignsList = [];
        if(tableDiv.style.display == 'none'){
            tableDiv.style.display = "flex";
        }
        var action = component.get("c.compairCampaigns");
        // set param to method  
        action.setParams({
            'campaign1': component.get("v.CampaignId1"),
            'campaign2': component.get("v.CampaignId2")
        });
        // set a callBack    
        action.setCallback(this, function(response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            //console.log('overlapCampaignsList',response.getReturnValue());
            if (state === "SUCCESS") {
                component.set("v.OverlapMembers",response.getReturnValue());
                this.scriptsLoaded(component, event, helper);
            }else{
                console.log('Error');
            }
        });
        // enqueue the Action  
        $A.enqueueAction(action);
        
    },
    
    // This function shows Charts.
    scriptsLoaded : function(component, event, helper) {
        $A.util.removeClass(component.find("buttonSpinner"), "slds-show");
        $A.util.addClass(component.find("buttonSpinner"), "slds-hide");
        var OverlapMembers = component.get("v.OverlapMembers");
        var SearchKeyWord = component.get("v.SearchKeyWord");
        var SearchKeyWord1 = component.get("v.SearchKeyWord1");
        var chartId1 = component.find("pie-chart1").getElement();
        //chartId1.clear();
        var labelSet=[] ;
        labelSet.push('Lead');
        labelSet.push('Contact');
        var chart1 = {};
        chart1 = new Chart(chartId1, {
            type: 'doughnut',
            data: {
                labels:labelSet,
                datasets: [{
                    label: 'Campaign1',
                    backgroundColor: ["#FFA500","#48C9B0"],
                    data: [OverlapMembers.totalLeadMembersInCampaign1,OverlapMembers.totalContactMembersInCampaign1]
                }]
            },
            options: {
                responsive: true,
                elements: {
                    display: true,
                    center: {
                        display: true,
                        text: OverlapMembers.totalLeadMembersInCampaign1 + OverlapMembers.totalContactMembersInCampaign1,
                        color: '#36A2EB', //Default black
                        fontStyle: 'Helvetica', //Default Arial
                        sidePadding: 10 //Default 20 (as a percentage)
                    }
                },
                title: {
                    display: true,
                    text: 'Total Members of ' + SearchKeyWord,
                }
            },
        });
        chartId1.addEventListener('click', function (evt) {
            $A.util.addClass(component.find("buttonSpinner"), "slds-show");
            $A.util.removeClass(component.find("buttonSpinner"), "slds-hide");
			var activePoints = chart1.getElementsAtEvent(evt);
            var activeDataSet = chart1.getDatasetAtEvent(evt);
            
            if (activePoints.length > 0)
            {
                var clickedLabelIndex = activePoints[0]._index;
                var clickedDatasetIndex = activeDataSet[0]._datasetIndex;
                var campaignDetails = chart1.data.datasets[clickedDatasetIndex].label;
                console.log("campaignDetails",campaignDetails);
                var label = chart1.data.labels[clickedLabelIndex];
				var modalWindow = document.getElementById('modal-content-1');
				var modalBackdrop = document.getElementById('modal-content');
                var action = component.get("c.getCampaignsRecord");
                var SOQLQueryWrapper;
                if(label == 'Lead'){
                	SOQLQueryWrapper = component.get("v.leadSoqlQueries");    
                }
                else{
                	SOQLQueryWrapper = component.get("v.contactSoqlQueries");    
                }
                //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@',JSON.stringify(SOQLQueryWrapper));
                if(label == 'Lead' && campaignDetails == 'Campaign1'){
                    // set param to method  
                    action.setParams({
                        'campaign': component.get("v.CampaignId1"),
                        'campaign1': null,
                        'sObj': label,
                        'queryWrapper' : JSON.stringify(SOQLQueryWrapper)
                    });
				}else if(label == 'Contact'  && campaignDetails == 'Campaign1'){
                    // set param to method  
                    action.setParams({
                        'campaign': component.get("v.CampaignId1"),
                        'sObj': label, 
                        'queryWrapper' : JSON.stringify(SOQLQueryWrapper)   
                    });
				}
                // set a callBack    
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    console.log('Result Re');
                    if (state === "SUCCESS") {
                        component.set('v.Title',SearchKeyWord);
                        $A.util.removeClass(component.find("buttonSpinner"), "slds-show");
                        $A.util.addClass(component.find("buttonSpinner"), "slds-hide");
                        //console.log("response.getReturnValue().sObjRecord",response.getReturnValue().sObjRecord);
                        var fMaplist = response.getReturnValue().fLabelList;
                        var listOfRecords = response.getReturnValue().sObjRecord;
                        component.set('v.columns', fMaplist);
                        component.set('v.data', helper.loadJSON(listOfRecords,fMaplist));
                        modalWindow.style.display = 'block';
                        modalBackdrop.style.display = 'block';
                    }else{
                        console.log('Error');
                    }
                });
                // enqueue the Action  
                $A.enqueueAction(action);
			}
        }, false);
        var chartId2 = component.find("pie-chart2").getElement();
        //chartId2.remove();
        var chart2 = {};
        chart2 = new Chart(chartId2, {
            type: 'doughnut',
            data: {
                labels:labelSet,
                datasets: [{
                    label: 'Campaign2',
                    backgroundColor: ["#FFA500","#48C9B0"],
                    data: [OverlapMembers.totalLeadMembersInCampaign2,OverlapMembers.totalContactMembersInCampaign2]
                }]
            },
            options: {
                elements: {
                    display: true,
                    center: {
                        display: true,
                        text: OverlapMembers.totalLeadMembersInCampaign2 + OverlapMembers.totalContactMembersInCampaign2,
                        color: '#36A2EB', //Default black
                        fontStyle: 'Helvetica', //Default Arial
                        sidePadding: 10 //Default 20 (as a percentage)
                    }
                },
                title: {
                    display: true,
                    text: 'Total Members of ' + SearchKeyWord1,
                }
            }
        });
        chartId2.addEventListener('click', function (evt) {
            $A.util.addClass(component.find("buttonSpinner"), "slds-show");
            $A.util.removeClass(component.find("buttonSpinner"), "slds-hide");
            var activePoints = chart2.getElementsAtEvent(evt);
            var activeDataSet = chart2.getDatasetAtEvent(evt);
            if (activePoints.length > 0)
            {
                var clickedLabelIndex = activePoints[0]._index;
                var clickedDatasetIndex = activeDataSet[0]._datasetIndex;
                var campaignDetails = chart2.data.datasets[clickedDatasetIndex].label;
                //console.log("campaignDetails",campaignDetails);
                var label = chart2.data.labels[clickedLabelIndex];
                var modalWindow = document.getElementById('modal-content-1');
                var modalBackdrop = document.getElementById('modal-content');
                var action = component.get("c.getCampaignsRecord");
                var SOQLQueryWrapper;
                if(label == 'Lead'){
                	SOQLQueryWrapper = component.get("v.leadSoqlQueries");    
                }
                else{
                	SOQLQueryWrapper = component.get("v.contactSoqlQueries");    
                }
                //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@',JSON.stringify(SOQLQueryWrapper));
                
                if(label == 'Lead' && campaignDetails == 'Campaign2'){
                    // set param to method  
                    action.setParams({
                        'campaign': component.get("v.CampaignId1"),
                        'sObj': label, 
                        'queryWrapper' : JSON.stringify(SOQLQueryWrapper)  
                    });
                }else if(label == 'Contact'  && campaignDetails == 'Campaign2'){
                    // set param to method  
                    action.setParams({
                        'campaign': component.get("v.CampaignId1"),
                        'sObj': label, 
                        'queryWrapper' : JSON.stringify(SOQLQueryWrapper)  
                    });
                }
                // set a callBack    
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set('v.Title',SearchKeyWord1);
                        $A.util.removeClass(component.find("buttonSpinner"), "slds-show");
                        $A.util.addClass(component.find("buttonSpinner"), "slds-hide");
                        var fMaplist = response.getReturnValue().fLabelList;
                        var listOfRecords = response.getReturnValue().sObjRecord;
                        component.set('v.columns', fMaplist);
                        component.set('v.data', helper.loadJSON(listOfRecords,fMaplist));
                        modalWindow.style.display = 'block';
                        modalBackdrop.style.display = 'block';
                    }else{
                        console.log('Error');
                    }
                });
                // enqueue the Action  
                $A.enqueueAction(action);
            }
        }, false);
        var chartId3 = component.find("pie-chart3").getElement();
        //chartId3.remove();
        var labelSet1=[] ;
        labelSet1.push('Overlap Leads');
        labelSet1.push('Overlap Contacts');
        var chart3 = {};
        chart3 = new Chart(chartId3, {
            type: 'doughnut',
            data: {
                labels:labelSet1,
                datasets: [{
                    label: 'OverlapCampaign',
                    backgroundColor: ["#FFA500","#48C9B0"],
                    data: [OverlapMembers.overlapLeadMembersInCampaign,OverlapMembers.overlapContactMembersInCampaign]
                }]
            },
            options: {
                elements: {
                    display: true,
                    center: {
                        display: true,
                        text: OverlapMembers.overlapLeadMembersInCampaign + OverlapMembers.overlapContactMembersInCampaign,
                        color: '#36A2EB', //Default black
                        fontStyle: 'Helvetica', //Default Arial
                        sidePadding: 10 //Default 20 (as a percentage)
                    }
                },
                title: {
                    display: true,
                    text: 'Total Overlap Members',
                }
            }
        });
        chartId3.addEventListener('click', function (evt) {
            $A.util.addClass(component.find("buttonSpinner"), "slds-show");
            $A.util.removeClass(component.find("buttonSpinner"), "slds-hide");
			var activePoints = chart3.getElementsAtEvent(evt);
            var activeDataSet = chart3.getDatasetAtEvent(evt);
            if (activePoints.length > 0)
            {
                var clickedLabelIndex = activePoints[0]._index;
                var clickedDatasetIndex = activeDataSet[0]._datasetIndex;
                var campaignDetails = chart3.data.datasets[clickedDatasetIndex].label;
                //console.log("campaignDetails",campaignDetails);
                var label = chart3.data.labels[clickedLabelIndex];
				var modalWindow = document.getElementById('modal-content-1');
				var modalBackdrop = document.getElementById('modal-content');
                var action = component.get("c.getCampaignsRecord");
                var SOQLQueryWrapper;
                if(label == 'Overlap Leads'){
                	SOQLQueryWrapper = component.get("v.leadSoqlQueries");    
                }
                else{
                	SOQLQueryWrapper = component.get("v.contactSoqlQueries");    
                }
                //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@',JSON.stringify(SOQLQueryWrapper));
                
				if(label == 'Overlap Leads' && campaignDetails == 'OverlapCampaign'){
                    // set param to method  
                    action.setParams({
                        'campaign': component.get("v.CampaignId1"),
                        'campaign1': component.get("v.CampaignId2"),
                        'sObj': label,
                        'queryWrapper' : JSON.stringify(SOQLQueryWrapper)  
                    });
				}else if(label == 'Overlap Contacts' && campaignDetails == 'OverlapCampaign'){
                    // set param to method  
                    action.setParams({
                        'campaign': component.get("v.CampaignId1"),
                        'campaign1': component.get("v.CampaignId2"),
                        'label': 'Overlap Contacts',
                        'queryWrapper' : JSON.stringify(SOQLQueryWrapper)  
                    });
                }
                // set a callBack    
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set('v.Title','Overlap Members');
                        $A.util.removeClass(component.find("buttonSpinner"), "slds-show");
                        $A.util.addClass(component.find("buttonSpinner"), "slds-hide");
                        var fMaplist = response.getReturnValue().fLabelList;
                        var listOfRecords = response.getReturnValue().sObjRecord;
                        component.set('v.columns', fMaplist);
                        component.set('v.data', helper.loadJSON(listOfRecords,fMaplist));
                        modalWindow.style.display = 'block';
                        modalBackdrop.style.display = 'block';
                    }else{
                        console.log('Error');
                    }
                });
                // enqueue the Action  
                $A.enqueueAction(action);
			}
        }, false);
        Chart.pluginService.register({
            beforeDraw: function (chart) {
                if (chart.config.options.elements.center) {
                    //Get ctx from string
                    var ctx = chart.chart.ctx;
                    
                    //Get options from the center object in options
                    var centerConfig = chart.config.options.elements.center;
                    var fontStyle = centerConfig.fontStyle || 'Arial';
                    var txt = centerConfig.text;
                    var color = centerConfig.color || '#000';
                    var sidePadding = centerConfig.sidePadding || 20;
                    var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
                    //Start with a base font of 30px
                    ctx.font = "10" + fontStyle;
                    
                    //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                    var stringWidth = ctx.measureText(txt).width;
                    var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
                    
                    // Find out how much the font can grow in width.
                    var widthRatio = elementWidth / stringWidth;
                    var newFontSize = Math.floor(7 * widthRatio);
                    var elementHeight = (chart.innerRadius);
                    
                    // Pick a new font size so it will not be larger than the height of label.
                    var fontSizeToUse = Math.min(newFontSize, elementHeight);
                    
                    //Set font settings to draw it correctly.
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                    var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                    ctx.font = fontSizeToUse+"px " + fontStyle;
                    ctx.fillStyle = color;
                    ctx.fillText('', centerX, centerY)
                    //Draw text in center
                    ctx.fillText(txt, centerX, centerY);
                }
            },
           	/*afterEvent : function (chart) {
                if (chart.config.options.elements.center) {
                    //Get ctx from string
                    var ctx = chart.chart.ctx;
                    
                    //Get options from the center object in options
                    var centerConfig = chart.config.options.elements.center;
                    centerConfig.text = '';
                    var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                    var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                    
                    //Draw text in center
                    ctx.fillText('', centerX, centerY);
                }
            }*/
        });
	},
    // This function shows Charts.
    loadJSON : function(listOfRecords,fMaplist) {
        var recordsJSON = '[';
        var record;
        var fName;
        for(record in listOfRecords){
            recordsJSON += '{';
            for(fName in fMaplist){
                
                recordsJSON += '\"'+fMaplist[fName].fieldName+'\"'+':';
                if(fMaplist[fName].fieldName.indexOf('.') != -1 && listOfRecords[record] != undefined){
                    var listReference  = fMaplist[fName].fieldName.split('.');
                    if(listOfRecords[record][listReference[0]] != undefined){
                        var value = listOfRecords[record][listReference[0]][listReference[1]];
                        if(value !== undefined && value.indexOf("'") != -1){
                            value = value.replace("\\'","");
                        }
                        if(value !== undefined && value.indexOf('"') != -1){
                            console.log('#####',value)
                            value = value.replace('"','');
                            value = value.replace('"','');
                        }    
                    }
                    else{
                        value = '';
                    }
                    
                    
                    recordsJSON += '\"'+value+'\",';
                }
                else if(listOfRecords[record] != undefined){
                    value = listOfRecords[record][fMaplist[fName].fieldName];
                    if(value !== undefined && value.indexOf("'") != -1){
                        value = value.replace("\\'","");
                    }
                    if(value !== undefined && value.indexOf('"') != -1){
                        value = value.replace('"','');
                        value = value.replace('"','');
                    } 
                    
                    recordsJSON += '\"'+value+'\",';
                }
            }
            recordsJSON = recordsJSON.substring(0, recordsJSON.length - 1);
            recordsJSON += '},';
        }    
        recordsJSON = recordsJSON.substring(0, recordsJSON.length - 1);
        recordsJSON += ']';
        for(fName in fMaplist){
            if(fMaplist[fName].fieldName.indexOf('.') != -1){
                fMaplist[fName].fieldName = fMaplist[fName].fieldName;
            }
        }
        //console.log('JSON Parsing Starting',recordsJSON);
        var parsedJSON = JSON.parse(recordsJSON);
        console.log('JSON Parsing Completed');
        
        return parsedJSON;
    }
})