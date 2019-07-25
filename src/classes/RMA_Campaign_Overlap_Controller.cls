public class RMA_Campaign_Overlap_Controller {
    // Return Campaign Record on Load
    @AuraEnabled
    public static List<Campaign> getCampaign(String searchKeyWord) {
        String sQuery;
        if(searchKeyWord != ''){
            String searchKey = '%' + searchKeyWord + '%';
            // Create a Dynamic SOQL Query For Fetch Campaign Record List 
            sQuery = 'select Id, Name, Type, Status from Campaign where Name LIKE: searchKey order by createdDate DESC';
        }else{
            sQuery = 'SELECT Id, Name, Type, Status FROM Campaign';
        }
        return Database.query(sQuery);
    }
    
    // Return Contact and Lead SOQL queries
    @AuraEnabled
    public static List<SOQLQueries> getSOQLQueries() {
        List<SOQLQueries> listQuery = new List<SOQLQueries>();
        SOQLQueries leadObj = new SOQLQueries();
        leadObj.obj = 'Lead';
        leadObj = RMA_Campaign_Overlap_Controller.getQuery('Lead',leadObj);
        listQuery.add(leadObj);    
        SOQLQueries conObj = new SOQLQueries();
        conObj.obj = 'Contact';
        conObj = RMA_Campaign_Overlap_Controller.getQuery('Contact',conObj);
        listQuery.add(conObj);  
        return listQuery;
    }
    
    public Static SOQLQueries getQuery(String sObj, SOQLQueries ObjSOQL){
        Schema.FieldSet sObjFset;
        if(sObj == 'Lead'){
            sObjFset = Schema.getGlobalDescribe().get(sObj).getDescribe().fieldSets.getMap().get('Overlap_Lead_Members');
        }else if(sObj == 'Contact'){
            sObjFset = Schema.getGlobalDescribe().get(sObj).getDescribe().fieldSets.getMap().get('Overlap_Contact_Members');
        }
        List<Schema.FieldSetMember> fieldSet = sObjFset.getFields();
        List<FieldSetWrapper> fMaplist = new List<FieldSetWrapper>();
        for (Schema.FieldSetMember fmem: fieldSet) {
            fMaplist.add(new FieldSetWrapper(fmem.getLabel(), fmem.getFieldPath(), String.valueOf(fmem.type)));
        }
        System.debug('fMaplist'+fMaplist);
        String fAPIname = '';
        String referanceFields;
        
        for(FieldSetWrapper fName : fMaplist){
            fAPIname += fName.fieldName + ',';
            if(fName.type == 'REFERENCE'){
                referanceFields = fName.fieldName;
            }
        }
        String soqlQuery;
        fAPIname += ' Id ';
        if(sObj == 'Lead'){
            soqlQuery = 'Select ' + fAPIname + ' from ' + sObj ;
        }else if(sObj == 'Contact'){
            soqlQuery = 'Select ' + fAPIname + ' from ' + sObj ;
        }
        ObjSOQL.fLabelList = fMaplist;
        ObjSOQL.query = soqlQuery ;
        
        return ObjSOQL;
    }
    
    
    public Class SOQLQueries{
        @AuraEnabled
        public String query;
        @AuraEnabled
        public String obj;
        @AuraEnabled
        public List<FieldSetWrapper> fLabelList;
        
        public SOQLQueries(){
           
        }        
    }
    // Return Campaign Record after Compair Campaigns
    @AuraEnabled
    public static overlapMembers compairCampaigns(Id campaign1, Id campaign2) {
        Integer totalLeadMembersInCampaign1 = 0;
        Integer totalLeadMembersInCampaign2 = 0;
        Integer totalContactMembersInCampaign1 = 0;
        Integer totalContactMembersInCampaign2 = 0;
        Integer overlapLeadMembersInCampaign = 0;
        Integer overlapContactMembersInCampaign = 0;
        
        totalContactMembersInCampaign1 = database.countQuery('select count() from CampaignMember where CampaignId =: campaign1 and ContactId != null');
        totalLeadMembersInCampaign1 = database.countQuery('select count() from CampaignMember where CampaignId =: campaign1 and LeadId != null');
        
        totalContactMembersInCampaign2 = database.countQuery('select count() from CampaignMember where CampaignId =: campaign2 and ContactId != null');
        totalLeadMembersInCampaign2 = database.countQuery('select count() from CampaignMember where CampaignId =: campaign2 and LeadId != null');
        
        overlapContactMembersInCampaign  = database.countQuery('select count() from Contact where Id in (Select ContactId From CampaignMember where CampaignId  = :campaign1  and ContactId != null) and  Id in (Select ContactId From CampaignMember where CampaignId  = :campaign2  and ContactId != null)');
        overlapLeadMembersInCampaign  = database.countQuery('select count() from Lead where Id in (Select LeadId From CampaignMember where CampaignId  = :campaign1  and LeadId != null) and  Id in (Select LeadId From CampaignMember where CampaignId  = :campaign2  and LeadId != null) ');
        
        overlapMembers overlapCampaignMembers = new overlapMembers(totalLeadMembersInCampaign1, totalLeadMembersInCampaign2, 
                                                                   totalContactMembersInCampaign1, totalContactMembersInCampaign2, 
                                                                   overlapContactMembersInCampaign, overlapLeadMembersInCampaign);
        
        return overlapCampaignMembers;
    }
    
    
    // Return Campaign Record.
    @AuraEnabled
    public static FieldSetLabel getCampaignsRecord(String campaign, String campaign1, String sObj, String queryWrapper){
        try{
            SOQLQueries soqlQueries = (SOQLQueries)JSON.deserialize(queryWrapper, SOQLQueries.class);
            system.debug('campaign'+campaign);
            system.debug('campaign1'+campaign1);
            system.debug('sObj'+sObj);
            Schema.FieldSet sObjFset;
            String soqlQuery;
            if(campaign1 == null){
                if(sObj == 'Lead'){
                    soqlQuery = soqlQueries.query+ ' where Id in (Select LeadId From CampaignMember where CampaignId =:campaign and LeadId != null)';
                }else if(sObj == 'Contact'){
                    soqlQuery = soqlQueries.query+ ' where Id in (Select ContactId From CampaignMember where CampaignId =:campaign and ContactId != null)';
                }
            }else{
                
                if(sObj == 'Overlap Leads'){
                    soqlQuery = soqlQueries.query+ ' where Id in (Select LeadId From CampaignMember where (CampaignId = :campaign OR CampaignId  = :campaign1) and LeadId != null)';
                }else {
                    soqlQuery = soqlQueries.query+ ' where Id in (Select ContactId From CampaignMember where (CampaignId =:campaign OR CampaignId  = :campaign1) and ContactId != null) ';
                }
            }
            //System.assert(false,soqlQuery);
            List<Sobject> listOfRecords = Database.query(soqlQuery);
            FieldSetLabel FieldSetLabelList = new FieldSetLabel(soqlQueries.fLabelList,listOfRecords);
            return FieldSetLabelList;
        }
        Catch(Exception e){
            System.assert(false,e.getStackTraceString()+'####'+e.getMessage());
            FieldSetLabel FieldSetLabelList = new FieldSetLabel(null,null);
            FieldSetLabelList.error = e.getStackTraceString()+'####'+e.getMessage();
            return FieldSetLabelList;
        }
    }
    
    
    //Wrapper Classes
    public class overlapMembers{
        @AuraEnabled public Integer totalLeadMembersInCampaign1;
        @AuraEnabled public Integer totalLeadMembersInCampaign2;
        @AuraEnabled public Integer totalContactMembersInCampaign1;
        @AuraEnabled public Integer totalContactMembersInCampaign2;
        @AuraEnabled public Integer overlapContactMembersInCampaign;
        @AuraEnabled public Integer overlapLeadMembersInCampaign;
        public overlapMembers(Integer totalLeadMembersInCampaign1, Integer totalLeadMembersInCampaign2, 
                              Integer totalContactMembersInCampaign1, Integer totalContactMembersInCampaign2, 
                              Integer overlapContactMembersInCampaign, Integer overlapLeadMembersInCampaign){
                                  this.totalLeadMembersInCampaign1 = totalLeadMembersInCampaign1;
                                  this.totalLeadMembersInCampaign2 = totalLeadMembersInCampaign2;
                                  this.totalContactMembersInCampaign1 = totalContactMembersInCampaign1;
                                  this.totalContactMembersInCampaign2 = totalContactMembersInCampaign2;
                                  this.overlapContactMembersInCampaign = overlapContactMembersInCampaign;
                                  this.overlapLeadMembersInCampaign = overlapLeadMembersInCampaign;
                                  
                              }
    }
    
    public class FieldSetLabel {
        @AuraEnabled public List<FieldSetWrapper> fLabelList;
        @AuraEnabled public List<SObject> sObjRecord;
        @AuraEnabled public String error;
        
        
        public FieldSetLabel(List<FieldSetWrapper> fLabelList, List<SObject> sObjRecord){
            this.fLabelList = fLabelList;
            this.sObjRecord = sObjRecord;
        }
    }
    
    public class FieldSetWrapper {
        @AuraEnabled public String label;
        @AuraEnabled public String fieldName;
        @AuraEnabled public String type;
        
        public FieldSetWrapper(String label, String fieldName, String type){
            this.label = label;
            this.fieldName = fieldName;
            this.type = type;
        }
    }
}