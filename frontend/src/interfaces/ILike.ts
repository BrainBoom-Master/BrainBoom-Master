export interface LikeInterface {
    ID?: number;
    UserID?: number;
    ReviewID?: number;
  }
  
  export interface LikeStatusResponse {
    UserID?: number;
    likeCount?: number; 
    HasLiked: boolean; 
  }