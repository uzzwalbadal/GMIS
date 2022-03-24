export class CustomCommonService{
    DateConvertonMethod(DatesToConvert: Date){
        let hoursDiff = DatesToConvert.getHours() - DatesToConvert.getTimezoneOffset() / 60;
        let minutesDiff = (DatesToConvert.getHours() - DatesToConvert.getTimezoneOffset()) % 60;
        DatesToConvert.setHours(hoursDiff);
        DatesToConvert.setMinutes(minutesDiff);

        return DatesToConvert;
    }

    getUpdateButtonAccess(){
        if(abp.auth.isGranted('Pages.Users')){
            // if(abp.auth.isGranted('Pages.Manager') || abp.auth.isGranted('Pages.Users')){
            return true;
        }else{
            return false; 
        }
    }

    getSaveButtonAccess(){
        if(abp.auth.isGranted('Pages.DataInsert') || abp.auth.isGranted('Pages.Users')|| abp.auth.isGranted('Pages.Admin')){
            return true;
        }else{
            return false; 
        }
    }

    getProjectid(){
        return sessionStorage.getItem("projectId");
    }

    getProjectName(){
        return sessionStorage.getItem("projectName");
    }
}