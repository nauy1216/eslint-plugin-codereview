import { packageAttribute, A } from 'src/utils/dictionary';
export interface IntroductionsStatisticsParams {
    year:number;
    month:number;
    attribute:packageAttribute.NORMAL | packageAttribute.ANNUAL;
    pageSize:number;
    pageIndex:number;
    teacherDepartmentIds?:number[];
    teacherInternalIds?:number[];
    sort?:string;
  };
  
  export interface IntroductionsCluesParams {
    year:number;
    month:number;
    teacherDepartmentIds?:number[];
    teacherInternalIds?:number[];
    classId?:number;
    recommendUserId?:number; // 转介绍人ID
    recommendedUserId?:number; // 被转介绍人ID
    firstChannelParam?:string; // 一级渠道参数
    secondChannelParam?:string;
    thirdChannelParam?:string;
    isAdvanced:boolean; // 是否是进阶课成单
    pageSize?:number;
    pageIndex?:number;
  };
  
  export interface ChannelsIntroductionsParams {
    channelLevel:1|2|3;
    channelId?:number;
  }
  