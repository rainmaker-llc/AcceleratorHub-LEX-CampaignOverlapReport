@isTest
public class RMA_Campaign_Overlap_Controller_Test {
    
    @testSetup static void setup() {
        List<Campaign> campaignList = new List<Campaign>();
        Campaign camp1 = new Campaign(Name = 'Test Campaign 1', Type = 'Advertisement', Status = 'Planning');
        Campaign camp2 = new Campaign(Name = 'Test Campaign 2', Type = 'Other', Status = 'Completed');
        campaignList.add(camp1);
        campaignList.add(camp2);
        insert campaignList;
    }
    
    @isTest
    public static void test_RMA_Campaign_Overlap_Controller(){
        List<Campaign> campaignList = RMA_Campaign_Overlap_Controller.getCampaign('');
        RMA_Campaign_Overlap_Controller.overlapMembers overlapCampaignMembers;
        overlapCampaignMembers = RMA_Campaign_Overlap_Controller.compairCampaigns(campaignList[0].Id, campaignList[1].Id);
        
        List<RMA_Campaign_Overlap_Controller.SOQLQueries> listQuery = new List<RMA_Campaign_Overlap_Controller.SOQLQueries>();
        listQuery = RMA_Campaign_Overlap_Controller.getSOQLQueries();
        
        String obj;
        String queryobj;
        for(RMA_Campaign_Overlap_Controller.SOQLQueries index : listQuery){
            if(index.obj == 'Lead'){
                obj = index.obj;
                queryobj = JSON.serialize(index);
            }else{
                obj = index.obj;
                queryobj = JSON.serialize(index);
            }
        }
        //system.Assert(False,'queryobj'+queryobj);
        RMA_Campaign_Overlap_Controller.getCampaignsRecord(campaignList[0].Id, campaignList[1].Id, obj, queryobj);
        
    }
}