({
    onInit: function(component,event, helper){
        helper.getSOQLQueries(component,event, helper);
    },
    // This function add value in list
    onfocus : function(component,event, helper){
        if(event.getSource().get("v.label") == 'Campaign 1'){
            // show the spinner,show child search result component and call helper function
            $A.util.addClass(component.find("mySpinner"), "slds-show");
            $A.util.removeClass(component.find("mySpinner"), "slds-hide");
            component.set("v.Campaign1", null ); 
            var CampaignLookup = document.getElementById("CampaignLookup");
            $A.util.addClass(CampaignLookup, 'slds-is-open');
            $A.util.removeClass(CampaignLookup, 'slds-is-close');
        }else if(event.getSource().get("v.label") == 'Campaign 2'){
            // show the spinner,show child search result component and call helper function
            $A.util.addClass(component.find("mySpinner1"), "slds-show");
            $A.util.removeClass(component.find("mySpinner1"), "slds-hide");
            component.set("v.Campaign2", null ); 
            var CampaignLookup = document.getElementById("CampaignLookup1");
            $A.util.addClass(CampaignLookup, 'slds-is-open');
            $A.util.removeClass(CampaignLookup, 'slds-is-close');
        }
        var getInputkeyWord = '';
        helper.searchHelper(component,event,getInputkeyWord);
    },
    
    // This function show list on click
    keyPressController : function(component, event, helper) {
        if(event.getSource().get("v.label") == 'Campaign 1'){
            $A.util.addClass(component.find("mySpinner"), "slds-show");
            $A.util.removeClass(component.find("mySpinner"), "slds-hide");
            // get the search Input keyword   
            var getInputkeyWord = component.get("v.SearchKeyWord");
            // check if getInputKeyWord size greater then 0 then open the lookup result List
            if(getInputkeyWord.length > 0){
                var CampaignLookup = document.getElementById("CampaignLookup");
                $A.util.addClass(CampaignLookup, 'slds-is-open');
                $A.util.removeClass(CampaignLookup, 'slds-is-close');
                helper.searchHelper(component,event,getInputkeyWord);
            }
            else{  
                component.set("v.Campaign1", null ); 
                var CampaignLookup = document.getElementById("CampaignLookup");
                $A.util.addClass(CampaignLookup, 'slds-is-close');
                $A.util.removeClass(CampaignLookup, 'slds-is-open');
            }
        }else if(event.getSource().get("v.label") == 'Campaign 2'){
            $A.util.addClass(component.find("mySpinner1"), "slds-show");
            $A.util.removeClass(component.find("mySpinner1"), "slds-hide");
            // get the search Input keyword   
            var getInputkeyWord = component.get("v.SearchKeyWord1");
            // check if getInputKeyWord size greater then 0 then open the lookup result List
            if(getInputkeyWord.length > 0){
                var CampaignLookup = document.getElementById("CampaignLookup1");
                $A.util.addClass(CampaignLookup, 'slds-is-open');
                $A.util.removeClass(CampaignLookup, 'slds-is-close');
                helper.searchHelper(component,event,getInputkeyWord);
            }
            else{  
                component.set("v.Campaign2", null ); 
                var CampaignLookup = document.getElementById("CampaignLookup1");
                $A.util.addClass(CampaignLookup, 'slds-is-close');
                $A.util.removeClass(CampaignLookup, 'slds-is-open');
            }
        }
    },
    
    // This function remove value form list
    onblur : function(component,event,helper){
        if(event.target.id == 'CampaignLookup'){
            // on mouse leave clear the listOfSeachRecords & hide the search result component 
            var CampaignLookup = document.getElementById('CampaignLookup');
            $A.util.addClass(CampaignLookup, 'slds-is-close');
            $A.util.removeClass(CampaignLookup, 'slds-is-open');
        }else if(event.target.id == 'CampaignLookup1'){
            // on mouse leave clear the listOfSeachRecords & hide the search result component 
            var CampaignLookup = document.getElementById("CampaignLookup1");
            $A.util.addClass(CampaignLookup, 'slds-is-close');
            $A.util.removeClass(CampaignLookup, 'slds-is-open');
        }
    },
    
    // This function call when the User Select any record from the result list.
    handleComponentEvent : function(component, event, helper) {
        // get the selected object record from the COMPONENT event 	 
        var selectedCampaignRecordFromEvent = event.getParam("recordByEvent");
        if(selectedCampaignRecordFromEvent[1] == 'Campaign1'){
            if(component.get("v.SearchKeyWord1") != '' || component.get("v.SearchKeyWord1") != selectedCampaignRecordFromEvent[0]){
                component.set("v.SearchKeyWord" , selectedCampaignRecordFromEvent[0]);
                component.set("v.CampaignId1" , selectedCampaignRecordFromEvent[2]);
            }
        }else if(selectedCampaignRecordFromEvent[1] == 'Campaign2'){
            if(component.get("v.SearchKeyWord") != '' || component.get("v.SearchKeyWord") != selectedCampaignRecordFromEvent[0]){
                component.set("v.SearchKeyWord1" , selectedCampaignRecordFromEvent[0]);
                component.set("v.CampaignId2" , selectedCampaignRecordFromEvent[2]);
            }
        }
        var CampaignLookup = document.getElementById("CampaignLookup");
        $A.util.addClass(CampaignLookup, 'slds-is-close');
        $A.util.removeClass(CampaignLookup, 'slds-is-open'); 
        var CampaignLookup1 = document.getElementById("CampaignLookup1");
        $A.util.addClass(CampaignLookup1, 'slds-is-close');
        $A.util.removeClass(CampaignLookup1, 'slds-is-open'); 
    },
    
    // This function call when the User click button.
    handleClick : function(component,event,helper){
        $A.util.addClass(component.find("buttonSpinner"), "slds-show");
        $A.util.removeClass(component.find("buttonSpinner"), "slds-hide");
        helper.handleClick(component,event,helper);
    },

    // This function close modal-content-1
    closeWindow : function(component, event, helper) {
        var modalWindow = document.getElementById('modal-content-1');
        var modalBackdrop = document.getElementById('modal-content');
        if(modalWindow.style.display == 'block'){
            modalWindow.style.display = 'none';
            modalBackdrop.style.display = 'none';
        }
    },
})