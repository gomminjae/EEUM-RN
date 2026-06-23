/** 원본 Domain/Entity/UserData + Data/DTO/UserDTO 이식 (동일 shape) */
export type UserData = {
  accessToken: string;
  tokenType: string;
  role: string;
  isRegistered: boolean;
};
