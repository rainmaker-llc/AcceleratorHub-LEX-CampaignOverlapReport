({
	selectRecord : function(component, event, helper){      
        // get the selected record from list  
        var campaignRecord = component.get("v.oRecord");
        var getSelectRecord = [];
        getSelectRecord.push(campaignRecord.Name);
        getSelectRecord.push(component.get("v.Campaign"));
        getSelectRecord.push(campaignRecord.Id);
        // call the event   
        var compEvent = component.getEvent("SelectedRecordEvent");
        // set the Selected sObject Record to the event attribute.  
        compEvent.setParams({"recordByEvent" : getSelectRecord });  
        // fire the event  
        compEvent.fire();
    },
})