import { MODES } from "../../constants/playModes";
import { createAction } from "../generators";
import { IMatchHistory, IServerStatus, IUser } from "./user.interfaces";

export enum ACTION_TYPE {
  "SET_CURRENT_USER" = "user_SET_CURRENT_USER",
  "FETCH_CURRENT_USER" = "user_FETCH_CURRENT_USER",
  "FETCH_MATCHES_HISTORY" = "user_FETCH_MATCHES_HISTORY",
  "SET_MATCHES_HISTORY" = "user_SET_MATCHES_HISTORY",
  "SET_SERVER_STATUS" = "user_SET_SERVER_STATUS",
  "FETCH_SERVER_STATUS" = "user_FETCH_SERVER_STATUS",
  "SET_CHOSE_MODE" = "user_SET_CHOSE_MODE",
}

export const Actions = {
  fetchCurrentUser: createAction<any>(ACTION_TYPE.FETCH_CURRENT_USER),
  setCurrentUser: createAction<Partial<IUser>>(ACTION_TYPE.SET_CURRENT_USER),
  fetchMatchesHistory: createAction<any>(ACTION_TYPE.FETCH_MATCHES_HISTORY),
  setMatchesHistory: createAction<IMatchHistory[]>(
    ACTION_TYPE.SET_MATCHES_HISTORY
  ),
  setServerStatus: createAction<IServerStatus>(ACTION_TYPE.SET_SERVER_STATUS),
  fetchServerStatus: createAction<any>(ACTION_TYPE.FETCH_SERVER_STATUS),
  setChoseMode: createAction<MODES>(ACTION_TYPE.SET_CHOSE_MODE),
};